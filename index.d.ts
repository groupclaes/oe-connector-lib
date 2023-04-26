export declare class OE {
  configuration: IConfiguration

  run(name: string, parameters: any[], options: IConfiguration): Promise<any>
  test(name: string, parameters: any[], options: IConfiguration): any
  configure(options: IConfiguration): void
}

declare interface IConfiguration {
  username?: string
  password?: string
  app?: string
  host?: string = 'localhost'
  ssl?: boolean = false
  port?: number = 5000
  tw?: number = 60000
  c?: boolean = false
  ct?: number = 3600000
  simpleParameters?: boolean = false
}

/** singleton Oe instance */
export declare const oe: OE;
export { };