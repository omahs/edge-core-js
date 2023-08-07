import type {
  EdgeContext,
  EdgeContextOptions,
  EdgeCorePlugins,
  EdgeCorePluginsInit,
  EdgeCrashReporter,
  EdgeFakeUser,
  EdgeFakeWorld,
  EdgeFakeWorldOptions,
  EdgeIo,
  EdgeLoginMessage,
  EdgeLogSettings,
  EdgeNativeIo,
  EdgeOnLog
} from './types'

export * from './types'

export declare function addEdgeCorePlugins(plugins: EdgeCorePlugins): void
export declare function lockEdgeCorePlugins(): void
export declare function closeEdge(): void
export declare function makeFakeIo(): EdgeIo

// System-specific io exports:
export declare function makeBrowserIo(): EdgeIo
export declare function makeNodeIo(path: string): EdgeIo

/**
 * Initializes the Edge core library,
 * automatically selecting the appropriate platform.
 */
export declare function makeEdgeContext(
  opts: EdgeContextOptions
): Promise<EdgeContext>

export declare function makeFakeEdgeWorld(
  users?: EdgeFakeUser[],
  opts?: EdgeFakeWorldOptions
): Promise<EdgeFakeWorld>

// ---------------------------------------------------------------------
// react-native
// ---------------------------------------------------------------------

interface CommonProps {
  // Allows the Chrome debugger to attach to the Android WebView.
  // This is mainly useful for debugging plugins,
  // since the `debug` prop also activates Chrome debugging.
  allowDebugging?: boolean

  // Enable core debugging.
  // You must call `yarn start` in the edge-core-js project for this to work:
  debug?: boolean

  // React Native modules to pass over the bridge to the plugins:
  nativeIo?: EdgeNativeIo

  // Extra JavaScript files to load into the core as plugins.
  // Relative URL's resolve to the app's default asset location:
  pluginUris?: string[]

  // Called if something goes wrong when starting the core:
  onError?: (error: any) => unknown
}

export interface EdgeContextProps extends CommonProps {
  onLoad: (context: EdgeContext) => unknown

  // EdgeFakeWorldOptions:
  crashReporter?: EdgeCrashReporter
  onLog?: EdgeOnLog

  // EdgeContextOptions:
  apiKey?: string
  appId?: string
  authServer?: string
  deviceDescription?: string
  hideKeys?: boolean
  logSettings?: Partial<EdgeLogSettings>
  plugins?: EdgeCorePluginsInit
  skipBlockHeight?: boolean
}

export interface EdgeFakeWorldProps extends CommonProps {
  onLoad: (world: EdgeFakeWorld) => unknown
  users?: EdgeFakeUser[]

  // EdgeFakeWorldOptions:
  crashReporter?: EdgeCrashReporter
  onLog?: EdgeOnLog
}

/**
 * We don't want this library to depend on `@types/react`,
 * since that isn't relevant for our Node or browser builds.
 */
type ComponentType<Props> = (
  props: Props
) => { type: any; props: any; key: string | number | null }

/**
 * React Native component for creating an EdgeContext.
 */
export declare const MakeEdgeContext: ComponentType<EdgeContextProps>

/**
 * React Native component for creating an EdgeFakeWorld for testing.
 */
export declare const MakeFakeEdgeWorld: ComponentType<EdgeFakeWorldProps>

/**
 * React Native function for getting login alerts without a context:
 */
export declare function fetchLoginMessages(apiKey: string): EdgeLoginMessage[]
