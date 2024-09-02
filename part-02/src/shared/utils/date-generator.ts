export class DateGenerator {
  public static now(): string {
    return new Date().toISOString()
  }
}