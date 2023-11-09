/* eslint-disable camelcase */
import type { Item, BorrowRequest, RequestAction } from '$lib/types';
import { eq } from 'drizzle-orm';
import { db } from './db/drizzle';
import { borrow_requests, items, request_actions } from './db/schema';

export class ServerBorrowRequest {
  borrow_request?: BorrowRequest;
  item?: Item;
  actions?: RequestAction[];

  constructor(
    borrow_request?: BorrowRequest,
    item?: Item,
    actions?: RequestAction[],
  ) {
    this.borrow_request = borrow_request;
    this.item = item;
    this.actions = actions;
  }

  static async fetchBorrowRequest(id: string) {
    try {
      const item_borrow_request_results = db
        .select({
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
          },
        })
        .from(borrow_requests)
        .where(eq(borrow_requests.id, id))
        .innerJoin(items, eq(items.id, borrow_requests.item_id));
      const actions_results: Promise<RequestAction[]> = db
        .select()
        .from(request_actions)
        .where(eq(request_actions.id, id));

      const results = await Promise.all([
        item_borrow_request_results,
        actions_results,
      ]);

      return new ServerBorrowRequest(
        results[0][0].borrow_request,
        // FIXME: the following cast is dangerous, there are missing field
        // because of the select above
        results[0][0].item as Item,
        results[1],
      );
    } catch (error) {
      return null;
    }
  }
  accept(_user_id: string) {}
}
