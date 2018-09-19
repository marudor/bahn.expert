// flow-typed signature: e138ebb7796cf2f11d0a6ad302003622
// flow-typed version: 471c78d820/koa-bunyan-logger_v2.x.x/flow_>=v0.39.x

/**
 * This is an libdef for:
 *
 *   'koa-bunyan-logger'
 *
 * NOTE: once import types from modules is working,
 * remove types redeclaration from bunyan and koa
 *
 */

declare module 'koa-bunyan-logger' {
  import type bunyan, { Serializers, Logger, LoggerOptions, BunyanLogLevels } from 'bunyan';

  import type { Middleware } from 'koa';

  declare type FieldsModifier = (fields: Object) => Object;
  declare type FieldsStringifier = (fields: Object) => string;

  declare type RequestLogger$Options = {
    durationField?: string,
    levelFn?: (status: number, err: Error) => BunyanLogLevels,
    updateLogFields?: FieldsModifier,
    updateRequestLogFields?: FieldsModifier,
    updateResponseLogFields?: FieldsModifier,
    formatRequestMessage?: FieldsStringifier,
    formatResponseMessage?: FieldsStringifier
  }

  declare type TimeContext$Options = {
    logLevel?: BunyanLogLevels,
    updateLogFields?: FieldsModifier
  }

  declare type RequestIdOptions = {
    header?: string,
    prop?: string,
    requestProp?: string,
    field?: string
  }

  declare module.exports: {
    requestIdContext(options?: RequestIdOptions): Middleware;
    requestLogger(options?: RequestLogger$Options): Middleware;
    timeContext(options: TimeContext$Options): Middleware;
    (options?: LoggerOptions & { name: string } | Logger): Middleware;
    bunyan: {
      stdSerializers: Serializers;
      createLogger(options: LoggerOptions & { name: string }): Logger;
    };
  };
}
