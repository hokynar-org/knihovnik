import type { Item, BorrowRequest, RequestAction } from "$lib/types";
import { eq } from "drizzle-orm";
import { db } from "./db/drizzle";
import { borrow_requests, items, request_actions } from "./db/schema";
import { error } from "@sveltejs/kit";

export class ServerBorrowRequest{
  borrow_request: BorrowRequest | undefined
  item: Item | undefined;
  actions:RequestAction[] | undefined;
  constructor(borrow_request?:BorrowRequest,item?:Item, actions?:RequestAction[]) {
    if(borrow_request){
      this.borrow_request=borrow_request;
    }
    if(item){
      this.item=item;
    }
    if(actions){
      this.actions=actions;
    }
  }
  static async fetchBorrowRequest(id:number){
    try {
      const item_borrow_request_results:Promise<{item:Item,borrow_request:BorrowRequest}[]> =
      db.select({
        item: {
          name: items.name,
          description: items.description,
          id: items.id,
          owner_id: items.owner_id,
          holder_id: items.holder_id,
          image_src: items.image_src,
        },
        borrow_request: {
          status: borrow_requests.status,
          id: borrow_requests.id,
          borrower_id: borrow_requests.borrower_id,
          lender_id: borrow_requests.lender_id,
          item_id: borrow_requests.item_id,
          timestamp: borrow_requests.timestamp,
        },}).from(borrow_requests).where(eq(borrow_requests.id, id))
         .innerJoin(items,eq(items.id,borrow_requests.item_id));
      const actions_results:Promise<RequestAction[]> = 
        db.select().from(request_actions).where(eq(request_actions.id,id));
      const results: [{item:Item,borrow_request:BorrowRequest}[],RequestAction[]] =
        await Promise.all([item_borrow_request_results,actions_results]);
      return new ServerBorrowRequest(results[0][0].borrow_request,results[0][0].item,results[1]);
    } catch (error) {
      return null;
    }
  }
  accept(user_id:number){
    
  }
}