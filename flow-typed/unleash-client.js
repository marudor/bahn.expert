declare module 'unleash-client' {
  declare type InitializeOptions = {
    url: string,
    instanceId: string,
    appName: string,
  };
  declare export function initialize(InitializeOptions): void;
  declare export function isEnabled(FeatureKeys): boolean;
}
