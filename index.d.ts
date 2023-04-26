declare class OE {
  configuration: IConfiguration

  run(name: string, parameters: any[], options: IConfiguration): Promise<any>
  test(name: string, parameters: any[], options: IConfiguration): any
  configure(options: IConfiguration): void
}

declare interface IConfiguration {
  username?: string
  password?: string
  app?: string
  host?: string
  ssl?: boolean
  port?: number
  tw?: number
  c?: boolean
  ct?: number
  simpleParameters?: boolean
}

/** singleton Oe instance */
declare const oe: OE
export = oe