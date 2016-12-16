import {random} from './crypto.js'
import scryptsy from 'scryptsy'

export const userIdSnrp = {
  'salt_hex': 'b5865ffb9fa7b3bfe4b2384d47ce831ee22a4a9d5c34c7ef7d21467cc758f81b',
  'n': 16384,
  'r': 1,
  'p': 1
}
export const passwordAuthSnrp = userIdSnrp

let timedSnrp = null

let timerNow = null
if (typeof window === 'undefined') {
  timerNow = function () {
    return Date.now()
  }
} else {
  timerNow = function () {
    return window.performance.now()
  }
}

/**
 * @param data A `Buffer` or byte-array object.
 * @param snrp A JSON SNRP structure.
 * @return A Buffer with the hash.
 */
export function scrypt (data, snrp) {
  const dklen = 32
  const salt = new Buffer(snrp.salt_hex, 'hex')
  return scryptsy(data, salt, snrp.n, snrp.r, snrp.p, dklen)
}

export function timeSnrp (snrp) {
  const startTime = timerNow()
  scrypt('random string', snrp)
  const endTime = timerNow()

  return endTime - startTime
}

function calcSnrpForTarget (targetHashTimeMilliseconds) {
  const snrp = {
    'salt_hex': random(32).toString('hex'),
    n: 16384,
    r: 1,
    p: 1
  }
  const timeElapsed = timeSnrp(snrp)

  let estTargetTimeElapsed = timeElapsed
  let nUnPowered = 0
  const r = (targetHashTimeMilliseconds / estTargetTimeElapsed)
  if (r > 8) {
    snrp.r = 8

    estTargetTimeElapsed *= 8
    const n = (targetHashTimeMilliseconds / estTargetTimeElapsed)

    if (n > 4) {
      nUnPowered = 4

      estTargetTimeElapsed *= 4
      const p = (targetHashTimeMilliseconds / estTargetTimeElapsed)
      snrp.p = Math.floor(p)
    } else {
      nUnPowered = Math.floor(n)
    }
  } else {
    snrp.r = r > 4 ? Math.floor(r) : 4
  }
  nUnPowered = nUnPowered >= 1 ? nUnPowered : 1
  snrp.n = Math.pow(2, nUnPowered + 13)

  // Actually time the new snrp:
  // const newTimeElapsed = timeSnrp(snrp)
  // console.log('timedSnrp: ' + snrp.n + ' ' + snrp.r + ' ' + snrp.p + ' oldTime:' + timeElapsed + ' newTime:' + newTimeElapsed)
  console.log('timedSnrp: ' + snrp.n + ' ' + snrp.r + ' ' + snrp.p + ' oldTime:' + timeElapsed)

  return snrp
}

export function makeSnrp () {
  if (!timedSnrp) {
    // Shoot for a 2s hash time:
    timedSnrp = calcSnrpForTarget(2000)
  }

  // Return a copy of the timed version with a fresh salt:
  return {
    'salt_hex': random(32).toString('hex'),
    'n': timedSnrp.n,
    'r': timedSnrp.r,
    'p': timedSnrp.p
  }
}