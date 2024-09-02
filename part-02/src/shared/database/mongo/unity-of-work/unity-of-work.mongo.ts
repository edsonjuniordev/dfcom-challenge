import { UnityOfWork, Work } from "@shared/unity-of-work/unity-of-work";
import { Injectable, Scope } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { ClientSession, Connection } from "mongoose";

@Injectable({ scope: Scope.TRANSIENT })
export class MongoUnityOfWork implements UnityOfWork {
  private works: Work[] = [];
  private session: ClientSession;

  constructor(
    @InjectConnection() private readonly connection: Connection
  ) { }

  public async start(): Promise<void> {
    this.session = await this.connection.startSession();
  }

  public addWork(work: Work): void {
    this.works.push(work);
  }

  public async commit(): Promise<void> {
    this.session.startTransaction();

    await Promise.all(this.works.map((work) => work(this.session)))

    await this.session.commitTransaction();
    await this.endSession();
  }

  public async abort(): Promise<void> {
    await this.session.abortTransaction();
    await this.endSession();
  }

  private async endSession(): Promise<void> {
    this.works = [];
    await this.session.endSession();
  }
}