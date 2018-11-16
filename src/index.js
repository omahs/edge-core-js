// @flow

import { type ArrayLike, type DiskletFile, type DiskletFolder } from 'disklet'
import { type Subscriber } from 'yaob'

// Sub-module exports:
import * as error from './error.js'
import * as internal from './internal.js'

export { error }
export { internal }

// Ancillary exports:
export { makeBrowserIo } from './io/browser/browser-io.js'
export { makeFakeIos } from './io/fake/fake-io.js'
export { makeNodeIo } from './io/node/node-io.js'
export { makeReactNativeIo } from './io/react-native/react-native-io.js'
export { fakeUser } from './io/fake/fakeUser.js'
export { fakeUser1 } from './io/fake/fakeUser1.js'
export {
  DustSpendError,
  errorNames,
  InsufficientFundsError,
  NetworkError,
  NoAmountSpecifiedError,
  ObsoleteApiError,
  OtpError,
  PasswordError,
  PendingFundsError,
  SameCurrencyError,
  SwapAboveLimitError,
  SwapBelowLimitError,
  SwapCurrencyError,
  SwapPermissionError,
  UsernameError
} from './error.js'
export { makeEdgeContext, makeFakeContexts } from './makeContext.js'
export { destroyAllContexts } from './modules/root.js'

// ---------------------------------------------------------------------
// io types
// ---------------------------------------------------------------------

export type { ArrayLike, DiskletFile, DiskletFolder }

// Node.js randomBytes function:
export type EdgeRandomFunction = (bytes: number) => Uint8Array

// The only subset of `Console` that Edge core uses:
export type EdgeConsole = {
  error(...data: Array<any>): void,
  info(...data: Array<any>): void,
  warn(...data: Array<any>): void
}

// The scrypt function Edge expects:
export type EdgeScryptFunction = (
  data: Uint8Array,
  salt: Uint8Array,
  n: number,
  r: number,
  p: number,
  dklen: number
) => Promise<Uint8Array>

export type EdgeSecp256k1 = {
  publicKeyCreate: (
    privateKey: Uint8Array,
    compressed: boolean
  ) => Promise<string>,
  privateKeyTweakAdd: (
    privateKey: Uint8Array,
    tweak: Uint8Array
  ) => Promise<Uint8Array>,
  publicKeyTweakAdd: (
    publicKey: Uint8Array,
    tweak: Uint8Array,
    compressed: boolean
  ) => Promise<Uint8Array>
}

export type EdgePbkdf2 = {
  deriveAsync: (
    key: Uint8Array,
    salt: Uint8Array,
    iter: number,
    len: number,
    algo: string
  ) => Promise<Uint8Array>
}

/**
 * Access to platform-specific resources.
 * The core never talks to the outside world on its own,
 * but always goes through this object.
 */
export type EdgeIo = {
  // Crypto:
  +random: EdgeRandomFunction,
  +scrypt: EdgeScryptFunction,
  // TODO: Make these two non-optional, providing JS versions as needed:
  +secp256k1?: EdgeSecp256k1,
  +pbkdf2?: EdgePbkdf2,

  // Local io:
  +console: EdgeConsole,
  +folder: DiskletFolder,

  // Networking:
  +fetch: typeof fetch,
  +Socket?: typeof net$Socket, // Still optional (no browser version)
  +TLSSocket?: typeof tls$TLSSocket, // Still optional (no browser version)
  +WebSocket: typeof WebSocket
}

export type EdgeCorePluginOptions = {
  io: EdgeIo
}

export type EdgePluginEnvironment = {
  io: EdgeIo,
  initOptions?: Object, // Load-time options (like API keys)
  userSettings?: Object // User-adjustable settings
}

// ---------------------------------------------------------------------
// key types
// ---------------------------------------------------------------------

export type EdgeWalletInfo = {
  id: string,
  type: string,
  keys: any
}

export type EdgeWalletInfoFull = {
  appIds: Array<string>,
  archived: boolean,
  deleted: boolean,
  id: string,
  keys: any,
  sortIndex: number,
  type: string
}

export type EdgeWalletState = {
  archived?: boolean,
  deleted?: boolean,
  sortIndex?: number
}

export type EdgeWalletStates = {
  [walletId: string]: EdgeWalletState
}

// ---------------------------------------------------------------------
// currency types
// ---------------------------------------------------------------------

// currency info -------------------------------------------------------

export type EdgeDenomination = {
  name: string,
  multiplier: string,
  symbol?: string
}

export type EdgeMetaToken = {
  currencyCode: string,
  currencyName: string,
  denominations: Array<EdgeDenomination>,
  contractAddress?: string,
  symbolImage?: string
}

export type EdgeCurrencyInfo = {
  // Basic currency information:
  currencyCode: string,
  currencyName: string,
  pluginName: string,
  denominations: Array<EdgeDenomination>,
  walletTypes: Array<string>,
  requiredConfirmations?: number,

  // Configuration options:
  defaultSettings: any,
  metaTokens: Array<EdgeMetaToken>,

  // Explorers:
  addressExplorer: string,
  blockExplorer?: string,
  transactionExplorer: string,

  // Images:
  symbolImage?: string,
  symbolImageDarkMono?: string
}

// spending ------------------------------------------------------------

export type EdgeMetadata = {
  name?: string,
  category?: string,
  notes?: string,
  amountFiat?: number,
  bizId?: number,
  miscJson?: string
}

export type EdgeNetworkFee = {
  +currencyCode: string,
  +nativeAmount: string
}

export type EdgeTransaction = {
  txid: string,
  date: number,
  currencyCode: string,
  blockHeight: number,
  nativeAmount: string,
  networkFee: string,
  ourReceiveAddresses: Array<string>,
  signedTx: string,
  parentNetworkFee?: string,
  metadata?: EdgeMetadata,
  otherParams: any,
  wallet?: EdgeCurrencyWallet // eslint-disable-line no-use-before-define
}

export type EdgeSpendTarget = {
  currencyCode?: string,
  destWallet?: EdgeCurrencyWallet, // eslint-disable-line no-use-before-define
  publicAddress?: string,
  nativeAmount?: string,
  destMetadata?: EdgeMetadata,
  otherParams?: Object
}

export type EdgePaymentProtocolInfo = {
  domain: string,
  memo: string,
  merchant: string,
  nativeAmount: string,
  spendTargets: Array<EdgeSpendTarget>
}

export type EdgeSpendInfo = {
  currencyCode?: string,
  noUnconfirmed?: boolean,
  privateKeys?: Array<string>,
  spendTargets: Array<EdgeSpendTarget>,
  nativeAmount?: string,
  quoteFor?: string,
  networkFeeOption?: string, // 'high' | 'standard' | 'low' | 'custom',
  customNetworkFee?: any, // Some kind of currency-specific JSON
  metadata?: EdgeMetadata,
  otherParams?: Object
}

// query data ----------------------------------------------------------

export type EdgeDataDump = {
  walletId: string,
  walletType: string,
  pluginType: string,
  data: {
    [dataCache: string]: any
  }
}

export type EdgeFreshAddress = {
  publicAddress: string,
  segwitAddress?: string,
  legacyAddress?: string
}

export type EdgeTokenInfo = {
  currencyCode: string,
  currencyName: string,
  contractAddress: string,
  multiplier: string
}

export type EdgeTxidMap = { [txid: string]: number }

// URI -----------------------------------------------------------------

export type EdgeParsedUri = {
  token?: EdgeTokenInfo,
  privateKeys?: Array<string>,
  publicAddress?: string,
  legacyAddress?: string,
  segwitAddress?: string,
  nativeAmount?: string,
  currencyCode?: string,
  metadata?: EdgeMetadata,
  bitIDURI?: string,
  bitIDDomain?: string,
  bitIDCallbackUri?: string,
  paymentProtocolUrl?: string,
  returnUri?: string,
  uniqueIdentifier?: string, // Ripple payment id
  bitidPaymentAddress?: string, // Experimental
  bitidKycProvider?: string, // Experimental
  bitidKycRequest?: string // Experimental
}

export type EdgeEncodeUri = {
  publicAddress: string,
  segwitAddress?: string,
  legacyAddress?: string,
  nativeAmount?: string,
  label?: string,
  message?: string
}

// options -------------------------------------------------------------

export type EdgeCurrencyCodeOptions = {
  currencyCode?: string
}

export type EdgeUnusedOptions = {}

export type EdgeGetTransactionsOptions = {
  currencyCode?: string,
  startIndex?: number,
  startEntries?: 100,
  startDate?: number,
  endDate?: number,
  searchString?: string,
  returnIndex?: number,
  returnEntries?: number,
  denomination?: string
}

// engine --------------------------------------------------------------

export type EdgeCurrencyEngineCallbacks = {
  +onBlockHeightChanged: (blockHeight: number) => void,
  +onTransactionsChanged: (abcTransactions: Array<EdgeTransaction>) => void,
  +onBalanceChanged: (currencyCode: string, nativeBalance: string) => void,
  +onAddressesChecked: (progressRatio: number) => void,
  +onTxidsChanged: (txids: EdgeTxidMap) => void
}

export type EdgeCurrencyEngineOptions = {
  callbacks: EdgeCurrencyEngineCallbacks,
  walletLocalFolder: DiskletFolder,
  walletLocalEncryptedFolder: DiskletFolder,
  optionalSettings?: any
}

export type EdgeCurrencyEngine = {
  startEngine(): Promise<mixed>,
  killEngine(): Promise<mixed>,
  getBlockHeight(): number,
  enableTokens(tokens: Array<string>): Promise<mixed>,
  disableTokens(tokens: Array<string>): Promise<mixed>,
  getEnabledTokens(): Promise<Array<string>>,
  addCustomToken(token: EdgeTokenInfo): Promise<mixed>,
  getTokenStatus(token: string): boolean,
  getBalance(options: EdgeCurrencyCodeOptions): string,
  getNumTransactions(options: EdgeCurrencyCodeOptions): number,
  getTransactions(
    options: EdgeGetTransactionsOptions
  ): Promise<Array<EdgeTransaction>>,
  getFreshAddress(options: EdgeCurrencyCodeOptions): EdgeFreshAddress,
  addGapLimitAddresses(
    addresses: Array<string>,
    options: EdgeUnusedOptions
  ): void,
  isAddressUsed(address: string, options: EdgeUnusedOptions): boolean,
  makeSpend(abcSpendInfo: EdgeSpendInfo): Promise<EdgeTransaction>,
  +sweepPrivateKeys?: (abcSpendInfo: EdgeSpendInfo) => Promise<EdgeTransaction>,
  signTx(abcTransaction: EdgeTransaction): Promise<EdgeTransaction>,
  broadcastTx(abcTransaction: EdgeTransaction): Promise<EdgeTransaction>,
  saveTx(abcTransaction: EdgeTransaction): Promise<mixed>,
  resyncBlockchain(): Promise<mixed>,
  dumpData(): EdgeDataDump,
  +getPaymentProtocolInfo?: (
    paymentProtocolUrl: string
  ) => Promise<EdgePaymentProtocolInfo>,
  getDisplayPrivateSeed(): string | null,
  getDisplayPublicSeed(): string | null,
  getTxids?: () => EdgeTxidMap
}

// currency plugin -----------------------------------------------------

export type EdgeBitcoinPrivateKeyOptions = {
  format?: string,
  coinType?: number,
  account?: number
}

export type EdgeCreatePrivateKeyOptions = {} | EdgeBitcoinPrivateKeyOptions

export type EdgeCurrencyPlugin = {
  +pluginName: string,
  +currencyInfo: EdgeCurrencyInfo,
  createPrivateKey(walletType: string, opts?: EdgeCreatePrivateKeyOptions): any, // TODO: Fix flow to allow Promise annotation
  derivePublicKey(walletInfo: EdgeWalletInfo): any, // TODO: Fix flow to allow Promise annotation
  makeEngine(
    walletInfo: EdgeWalletInfo,
    options: EdgeCurrencyEngineOptions
  ): Promise<EdgeCurrencyEngine>,
  parseUri(uri: string): EdgeParsedUri | Promise<EdgeParsedUri>,
  encodeUri(obj: EdgeEncodeUri): string | Promise<string>,
  +getSplittableTypes?: (walletInfo: EdgeWalletInfo) => Array<string>,
  +changeSettings?: (settings: Object) => Promise<mixed>
}

export type EdgeCurrencyPluginFactory = {
  +pluginType: 'currency',
  +pluginName: string,
  makePlugin(opts: EdgeCorePluginOptions): Promise<EdgeCurrencyPlugin>
}

// wallet --------------------------------------------------------------

export type EdgeCoinExchangeQuote = {
  depositAmountNative: string,
  withdrawalAmountNative: string,
  expiration: number, // this is in milliseconds since 1970/ it is a date.
  quotedRate: string,
  maxLimit: number,
  orderId: string,
  edgeTransacton: EdgeTransaction
}

export type EdgeBalances = { [currencyCode: string]: string }

export type EdgeReceiveAddress = EdgeFreshAddress & {
  metadata: EdgeMetadata,
  nativeAmount: string
}

export type EdgeCurrencyWalletEvents = {
  newTransactions: Array<EdgeTransaction>,
  transactionsChanged: Array<EdgeTransaction>
}

export type EdgeCurrencyWallet = {
  +on: Subscriber<EdgeCurrencyWalletEvents>,
  +watch: Subscriber<EdgeCurrencyWallet>,

  // Data store:
  +id: string,
  +keys: any,
  +type: string,
  +folder: DiskletFolder,
  +localFolder: DiskletFolder,
  sync(): Promise<mixed>,

  // Wallet keys:
  +displayPrivateSeed: string | null,
  +displayPublicSeed: string | null,

  // Wallet name:
  +name: string | null,
  renameWallet(name: string): Promise<mixed>,

  // Fiat currency option:
  +fiatCurrencyCode: string,
  setFiatCurrencyCode(fiatCurrencyCode: string): Promise<mixed>,

  // Currency info:
  +currencyInfo: EdgeCurrencyInfo,
  nativeToDenomination(
    nativeAmount: string,
    currencyCode: string
  ): Promise<string>,
  denominationToNative(
    denominatedAmount: string,
    currencyCode: string
  ): Promise<string>,

  // Chain state:
  +balances: EdgeBalances,
  +blockHeight: number,
  +syncRatio: number,

  // Running state:
  startEngine(): Promise<mixed>,
  stopEngine(): Promise<mixed>,

  // Token management:
  enableTokens(tokens: Array<string>): Promise<mixed>,
  disableTokens(tokens: Array<string>): Promise<mixed>,
  getEnabledTokens(): Promise<Array<string>>,
  addCustomToken(token: EdgeTokenInfo): Promise<mixed>,

  // Transactions:
  getNumTransactions(opts?: EdgeCurrencyCodeOptions): Promise<number>,
  getTransactions(
    options?: EdgeGetTransactionsOptions
  ): Promise<Array<EdgeTransaction>>,
  getReceiveAddress(
    opts?: EdgeCurrencyCodeOptions
  ): Promise<EdgeReceiveAddress>,
  saveReceiveAddress(receiveAddress: EdgeReceiveAddress): Promise<mixed>,
  lockReceiveAddress(receiveAddress: EdgeReceiveAddress): Promise<mixed>,
  makeSpend(spendInfo: EdgeSpendInfo): Promise<EdgeTransaction>,
  signTx(tx: EdgeTransaction): Promise<EdgeTransaction>,
  broadcastTx(tx: EdgeTransaction): Promise<EdgeTransaction>,
  saveTx(tx: EdgeTransaction): Promise<mixed>,
  sweepPrivateKeys(edgeSpendInfo: EdgeSpendInfo): Promise<EdgeTransaction>,
  saveTxMetadata(
    txid: string,
    currencyCode: string,
    metadata: EdgeMetadata
  ): Promise<mixed>,
  getMaxSpendable(spendInfo: EdgeSpendInfo): Promise<string>,
  getQuote(spendInfo: EdgeSpendInfo): Promise<EdgeCoinExchangeQuote>,
  getPaymentProtocolInfo(
    paymentProtocolUrl: string
  ): Promise<EdgePaymentProtocolInfo>,

  // Wallet management:
  resyncBlockchain(): Promise<mixed>,
  dumpData(): Promise<EdgeDataDump>,
  getDisplayPrivateSeed(): string | null,
  getDisplayPublicSeed(): string | null,

  // Data exports:
  exportTransactionsToQBO(opts: EdgeGetTransactionsOptions): Promise<string>,
  exportTransactionsToCSV(opts: EdgeGetTransactionsOptions): Promise<string>,

  // URI handling:
  parseUri(uri: string): Promise<EdgeParsedUri>,
  encodeUri(obj: EdgeEncodeUri): Promise<string>,

  // Deprecated API's:
  getBalance(opts?: EdgeCurrencyCodeOptions): string,
  getBlockHeight(): number
}

// ---------------------------------------------------------------------
// swap plugin
// ---------------------------------------------------------------------

export type EdgeSwapInfo = {
  +displayName: string,
  +pluginName: string,

  +quoteUri?: string, // The quoteId would be appended to this
  +supportEmail: string
}

export type EdgeSwapQuoteOptions = {
  fromCurrencyCode: string,
  fromWallet: EdgeCurrencyWallet,
  nativeAmount: string,
  quoteFor: 'from' | 'to',
  toCurrencyCode: string,
  toWallet: EdgeCurrencyWallet
}

export type EdgeSwapPluginQuote = {
  +fromNativeAmount: string,
  +toNativeAmount: string,
  +networkFee: EdgeNetworkFee,

  +pluginName: string,
  +expirationDate?: Date,
  +quoteId?: string,

  approve(): Promise<EdgeTransaction>,
  close(): Promise<mixed>
}

export type EdgeSwapTools = {
  +needsActivation: boolean,

  changeUserSettings(userSettings: Object): Promise<mixed>,
  fetchCurrencies(): Promise<Array<string>>,
  fetchQuote(opts: EdgeSwapQuoteOptions): Promise<EdgeSwapPluginQuote>
}

export type EdgeSwapPlugin = {
  +pluginType: 'swap',
  +swapInfo: EdgeSwapInfo,

  makeTools(env: EdgePluginEnvironment): Promise<EdgeSwapTools>
}

// ---------------------------------------------------------------------
// rate plugin
// ---------------------------------------------------------------------

export type EdgeExchangePairHint = {
  fromCurrency: string,
  toCurrency: string
}

export type EdgeExchangePair = {
  fromCurrency: string,
  toCurrency: string,
  rate: number
}

export type EdgeExchangePlugin = {
  +exchangeInfo: { exchangeName: string },

  fetchExchangeRates(
    pairHints: Array<EdgeExchangePairHint>
  ): Promise<Array<EdgeExchangePair>>
}

export type EdgeExchangePluginFactory = {
  +pluginType: 'exchange',
  makePlugin(opts: EdgeCorePluginOptions): Promise<EdgeExchangePlugin>
}

// ---------------------------------------------------------------------
// account
// ---------------------------------------------------------------------

export type EdgeAccountCallbacks = {
  +onDataChanged?: () => mixed,
  +onKeyListChanged?: () => mixed,
  +onLoggedOut?: () => mixed,
  +onOtpDrift?: (drift: number) => mixed,
  +onRemoteOtpChange?: () => mixed,
  +onRemotePasswordChange?: () => mixed,

  // Currency wallet callbacks:
  +onAddressesChecked?: (walletId: string, progressRatio: number) => mixed,
  +onBalanceChanged?: (
    walletId: string,
    currencyCode: string,
    nativeBalance: string
  ) => mixed,
  +onBlockHeightChanged?: (walletId: string, blockHeight: number) => mixed,
  +onNewTransactions?: (
    walletId: string,
    abcTransactions: Array<EdgeTransaction>
  ) => mixed,
  +onTransactionsChanged?: (
    walletId: string,
    abcTransactions: Array<EdgeTransaction>
  ) => mixed,
  +onWalletDataChanged?: (walletId: string) => mixed,
  +onWalletNameChanged?: (walletId: string, name: string | null) => mixed
}

export type EdgeAccountOptions = {
  otp?: string,
  callbacks?: EdgeAccountCallbacks
}

// currencies ----------------------------------------------------------

export type EdgeCreateCurrencyWalletOptions = {
  fiatCurrencyCode?: string,
  name?: string,

  // Used to tell the currency plugin what keys to create:
  keyOptions?: EdgeCreatePrivateKeyOptions,

  // Used to copy wallet keys between accounts:
  keys?: {}
}

export type EdgeCurrencyConfig = {
  +watch: Subscriber<EdgeCurrencyConfig>,

  +currencyInfo: EdgeCurrencyInfo,
  +userSettings: Object,

  changeUserSettings(settings: Object): Promise<mixed>,

  // Deprecated names:
  +settings: Object, // userSettings
  +pluginSettings: Object, // userSettings
  changeSettings(settings: Object): Promise<mixed>,
  changePluginSettings(settings: Object): Promise<mixed>
}

export type EthererumTransaction = {
  chainId: number, // Not part of raw data, but needed for signing
  nonce: string,
  gasPrice: string,
  gasLimit: string,
  to: string,
  value: string,
  data: string,
  // The transaction is unsigned, so these are not present:
  v?: string,
  r?: string,
  s?: string
}

// rates ---------------------------------------------------------------

export type EdgeRateCacheEvents = {
  update: mixed
}

export type EdgeRateCache = {
  +on: Subscriber<EdgeRateCacheEvents>,

  convertCurrency(
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): number
}

// swap ----------------------------------------------------------------

/**
 * Information and settings for a currency swap plugin.
 */
export type EdgeSwapConfig = {
  +watch: Subscriber<EdgeSwapConfig>,

  +enabled: boolean,
  +needsActivation: boolean,
  +swapInfo: EdgeSwapInfo,
  +userSettings: Object,

  changeEnabled(enabled: boolean): Promise<mixed>,
  changeUserSettings(settings: Object): Promise<mixed>,

  // Deprecated names:
  +exchangeInfo: Object, // swapInfo
  +settings: Object, // userSettings
  changeSettings(settings: Object): Promise<mixed>
}

// Currencies supported by various swap plugins:
export type EdgeSwapCurrencies = {
  [currencyCode: string]: {
    pluginNames: Array<string>,
    // Deprecated:
    exchanges: Array<string> // pluginNames
  }
}

export type EdgeSwapQuote = EdgeSwapPluginQuote & {
  +quoteUri?: string,

  // Deprecated names:
  +exchangeService: string // pluginName
}

// edge login ----------------------------------------------------------

export type EdgeLoginRequest = {
  +appId: string,
  approve(): Promise<mixed>,

  +displayName: string,
  +displayImageUrl: string | void
}

export type EdgeLobby = {
  +loginRequest: EdgeLoginRequest | void
  // walletRequest: EdgeWalletRequest | void
}

// storage -------------------------------------------------------------

export type EdgeDataStore = {
  deleteItem(storeId: string, itemId: string): Promise<mixed>,
  deleteStore(storeId: string): Promise<mixed>,

  listItemIds(storeId: string): Promise<Array<string>>,
  listStoreIds(): Promise<Array<string>>,

  getItem(storeId: string, itemId: string): Promise<string>,
  setItem(storeId: string, itemId: string, value: string): Promise<mixed>
}

// Deprecated:
export type EdgePluginData = {
  deleteItem(pluginId: string, itemId: string): Promise<mixed>,
  deletePlugin(pluginId: string): Promise<mixed>,

  listItemIds(pluginId: string): Promise<Array<string>>,
  listPluginIds(): Promise<Array<string>>,

  getItem(pluginId: string, itemId: string): Promise<string>,
  setItem(pluginId: string, itemId: string, value: string): Promise<mixed>
}

// account -------------------------------------------------------------

export type EdgeAccountEvents = {}

export type EdgeAccount = {
  +on: Subscriber<EdgeAccountEvents>,
  +watch: Subscriber<EdgeAccount>,

  // Data store:
  +id: string,
  +keys: any,
  +type: string,
  +folder: DiskletFolder,
  +localFolder: DiskletFolder,
  sync(): Promise<mixed>,

  // Basic login information:
  +appId: string,
  +loggedIn: boolean,
  +loginKey: string,
  +recoveryKey: string | void, // For email backup
  +username: string,

  // Special-purpose API's:
  +currencyConfig: { [pluginName: string]: EdgeCurrencyConfig },
  +rateCache: EdgeRateCache,
  +swapConfig: { [pluginName: string]: EdgeSwapConfig },
  +dataStore: EdgeDataStore,

  // What login method was used?
  +edgeLogin: boolean,
  +keyLogin: boolean,
  +newAccount: boolean,
  +passwordLogin: boolean,
  +pinLogin: boolean,
  +recoveryLogin: boolean,

  // Change or create credentials:
  changePassword(password: string): Promise<mixed>,
  changePin(opts: {
    pin?: string, // We keep the existing PIN if unspecified
    enableLogin?: boolean // We default to true if unspecified
  }): Promise<string>,
  changeRecovery(
    questions: Array<string>,
    answers: Array<string>
  ): Promise<string>,

  // Verify existing credentials:
  checkPassword(password: string): Promise<boolean>,
  checkPin(pin: string): Promise<boolean>,

  // Remove credentials:
  deletePassword(): Promise<mixed>,
  deletePin(): Promise<mixed>,
  deleteRecovery(): Promise<mixed>,

  // OTP:
  +otpKey: string | void, // OTP is enabled if this exists
  +otpResetDate: string | void, // A reset is requested if this exists
  cancelOtpReset(): Promise<mixed>,
  disableOtp(): Promise<mixed>,
  enableOtp(timeout?: number): Promise<mixed>,

  // Edge login approval:
  fetchLobby(lobbyId: string): Promise<EdgeLobby>,

  // Login management:
  logout(): Promise<mixed>,

  // Master wallet list:
  +allKeys: Array<EdgeWalletInfoFull>,
  changeWalletStates(walletStates: EdgeWalletStates): Promise<mixed>,
  createWallet(type: string, keys: any): Promise<string>,
  getFirstWalletInfo(type: string): ?EdgeWalletInfo,
  getWalletInfo(id: string): ?EdgeWalletInfo,
  listWalletIds(): Array<string>,
  listSplittableWalletTypes(walletId: string): Promise<Array<string>>,
  splitWalletInfo(walletId: string, newWalletType: string): Promise<string>,

  // Currency wallets:
  +activeWalletIds: Array<string>,
  +archivedWalletIds: Array<string>,
  +currencyWallets: { [walletId: string]: EdgeCurrencyWallet },
  createCurrencyWallet(
    type: string,
    opts?: EdgeCreateCurrencyWalletOptions
  ): Promise<EdgeCurrencyWallet>,
  waitForCurrencyWallet(walletId: string): Promise<EdgeCurrencyWallet>,

  // Web compatibility:
  signEthereumTransaction(
    walletId: string,
    transaction: EthererumTransaction
  ): Promise<string>,

  // Swapping:
  fetchSwapCurrencies(): Promise<EdgeSwapCurrencies>,
  fetchSwapQuote(opts: EdgeSwapQuoteOptions): Promise<EdgeSwapQuote>,

  // Deprecated names:
  +pluginData: EdgePluginData,
  +exchangeCache: EdgeRateCache,
  +currencyTools: { [pluginName: string]: EdgeCurrencyConfig },
  +exchangeTools: { [pluginName: string]: EdgeSwapConfig },
  getExchangeCurrencies(): Promise<EdgeSwapCurrencies>,
  getExchangeQuote(opts: EdgeSwapQuoteOptions): Promise<EdgeSwapQuote>
}

// ---------------------------------------------------------------------
// context types
// ---------------------------------------------------------------------

export type EdgeCorePluginFactory =
  | EdgeCurrencyPluginFactory
  | EdgeExchangePluginFactory

export type EdgeContextCallbacks = {
  +onError?: (e: Error) => mixed,
  +onExchangeUpdate?: () => mixed
}

export type EdgeContextOptions = {
  apiKey?: string, // TODO: Non-optional
  appId?: string, // TODO: Non-optional
  authServer?: string,
  callbacks?: EdgeContextCallbacks,
  hideKeys?: boolean,
  path?: string, // Only used on node.js
  plugins?: Array<EdgeCorePluginFactory>,
  shapeshiftKey?: string,
  changellyInit?: { apiKey: string, secret: string },

  // Used by the fake context:
  localFakeUser?: boolean,
  offline?: boolean,
  tempNoBridge$?: boolean
}

// deprecated ----------------------------------------------------------

export type EdgeExchangeSwapInfo = {
  rate: number,
  nativeMin: string,
  nativeMax: string,
  minerFee: string
}

// parameters ----------------------------------------------------------

export type EdgeEdgeLoginOptions = EdgeAccountOptions & {
  // Deprecated. The info server handles these now:
  displayImageUrl?: string,
  displayName?: string,

  // Deprecated (will crash in bridged contexts):
  onProcessLogin?: (username: string) => mixed,
  onLogin?: (e?: Error, account?: EdgeAccount) => mixed
}

export type EdgeLoginMessages = {
  [username: string]: {
    otpResetPending: boolean,
    recovery2Corrupt: boolean
  }
}

export type EdgePasswordRules = {
  secondsToCrack: number,
  tooShort: boolean,
  noNumber: boolean,
  noLowerCase: boolean,
  noUpperCase: boolean,
  passed: boolean
}

export type EdgePendingEdgeLogin = {
  +id: string,
  cancelRequest(): void
}

export type EdgeUserInfo = {
  pinLoginEnabled: boolean,
  username: string
}

// context -------------------------------------------------------------

export type EdgeContextEvents = {
  error: Error,
  login: EdgeAccount,
  loginStart: { username: string },
  loginError: { error: Error }
}

export type EdgeContext = {
  +on: Subscriber<EdgeContextEvents>,
  +watch: Subscriber<EdgeContext>,

  +appId: string,

  // Local user management:
  localUsers: Array<EdgeUserInfo>,
  fixUsername(username: string): string,
  listUsernames(): Promise<Array<string>>,
  deleteLocalAccount(username: string): Promise<mixed>,

  // Account creation:
  usernameAvailable(username: string): Promise<boolean>,
  createAccount(
    username: string,
    password?: string,
    pin?: string,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>,

  // Edge login:
  requestEdgeLogin(opts: EdgeEdgeLoginOptions): Promise<EdgePendingEdgeLogin>,

  // Fingerprint login:
  loginWithKey(
    username: string,
    loginKey: string,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>,

  // Password login:
  checkPasswordRules(password: string): EdgePasswordRules,
  loginWithPassword(
    username: string,
    pin: string,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>,

  // PIN login:
  pinLoginEnabled(username: string): Promise<boolean>,
  loginWithPIN(
    username: string,
    pin: string,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>,

  // Recovery2 login:
  getRecovery2Key(username: string): Promise<string>,
  loginWithRecovery2(
    recovery2Key: string,
    username: string,
    answers: Array<string>,
    opts?: EdgeAccountOptions
  ): Promise<EdgeAccount>,
  fetchRecovery2Questions(
    recovery2Key: string,
    username: string
  ): Promise<Array<string>>,
  listRecoveryQuestionChoices(): Promise<Array<string>>,

  // OTP stuff:
  requestOtpReset(username: string, otpResetToken: string): Promise<Date>,
  fetchLoginMessages(): Promise<EdgeLoginMessages>,

  // Shapeshift:
  getExchangeSwapRate(
    fromCurrencyCode: string,
    toCurrencyCode: string
  ): Promise<number>,
  getExchangeSwapInfo(
    fromCurrencyCode: string,
    toCurrencyCode: string
  ): Promise<EdgeExchangeSwapInfo>,
  getAvailableExchangeTokens(): Promise<Array<string>>
}

// ---------------------------------------------------------------------
// legacy names
// ---------------------------------------------------------------------

export type {
  EdgeConsole as AbcConsole,
  EdgeScryptFunction as AbcScryptFunction,
  EdgeSecp256k1 as AbcSecp256k1,
  EdgePbkdf2 as AbcPbkdf2,
  EdgeIo as AbcIo,
  EdgeCorePluginFactory as AbcCorePluginFactory,
  EdgeCorePluginOptions as AbcCorePluginOptions,
  EdgeContextCallbacks as AbcContextCallbacks,
  EdgeContextOptions as AbcContextOptions,
  EdgeContext as AbcContext,
  EdgeExchangeSwapInfo as AbcExchangeSwapInfo,
  EdgePasswordRules as AbcPasswordRules,
  EdgePendingEdgeLogin as AbcEdgeLoginRequest,
  EdgeEdgeLoginOptions as AbcEdgeLoginOptions,
  EdgeLoginMessages as AbcLoginMessages,
  EdgeWalletInfo as AbcWalletInfo,
  EdgeWalletInfoFull as AbcWalletInfoFull,
  EdgeWalletState as AbcWalletState,
  EdgeWalletStates as AbcWalletStates,
  EdgeAccountCallbacks as AbcAccountCallbacks,
  EdgeAccountOptions as AbcAccountOptions,
  EdgeCreateCurrencyWalletOptions as AbcCreateCurrencyWalletOptions,
  EdgeAccount as AbcAccount,
  EdgeLobby as AbcLobby,
  EdgeLoginRequest as AbcLoginRequest,
  EdgeCurrencyWallet as AbcCurrencyWallet,
  EdgeMetadata as AbcMetadata,
  EdgeSpendTarget as AbcSpendTarget,
  EdgeSpendInfo as AbcSpendInfo,
  EdgeTransaction as AbcTransaction,
  EdgeDenomination as AbcDenomination,
  EdgeMetaToken as AbcMetaToken,
  EdgeCurrencyInfo as AbcCurrencyInfo,
  EdgeParsedUri as AbcParsedUri,
  EdgeEncodeUri as AbcEncodeUri,
  EdgeFreshAddress as AbcFreshAddress,
  EdgeDataDump as AbcDataDump,
  EdgeReceiveAddress as AbcReceiveAddress,
  EdgeCurrencyEngineCallbacks as AbcCurrencyEngineCallbacks,
  EdgeCurrencyEngineOptions as AbcCurrencyEngineOptions,
  EdgeCurrencyEngine as AbcCurrencyEngine,
  EdgeCurrencyPlugin as AbcCurrencyPlugin,
  EdgeCurrencyPluginFactory as AbcCurrencyPluginFactory,
  EdgeExchangePairHint as AbcExchangePairHint,
  EdgeExchangePair as AbcExchangePair,
  EdgeExchangePlugin as AbcExchangePlugin,
  EdgeExchangePluginFactory as AbcExchangePluginFactory,
  // Wrong names:
  EdgeCorePluginFactory as AbcCorePlugin,
  EdgeContextOptions as AbcMakeContextOpts,
  EdgeCurrencyEngineOptions as AbcMakeEngineOptions,
  EdgeCurrencyEngineCallbacks as AbcCurrencyPluginCallbacks,
  EdgePendingEdgeLogin as EdgeEdgeLoginRequest,
  // Deprecated names:
  EdgeCurrencyConfig as EdgeCurrencyTools,
  EdgeRateCache as EdgeExchangeCache,
  EdgeSwapConfig as EdgeExchangeTools,
  EdgeSwapCurrencies as EdgeExchangeCurrencies,
  EdgeSwapQuote as EdgeExchangeQuote,
  EdgeSwapQuoteOptions as EdgeExchangeQuoteOptions
}

export type EdgeCurrencyToolsMap = { [pluginName: string]: EdgeCurrencyConfig }
