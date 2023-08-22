export interface FeedPlaner {
    feed_name: string,
    feed_type: string,
    batch_no?: string,
    assign_type: string,
    tag_no?: string,
    status?: string,
    quantity: number,
    cost: number,
    date: Date;

}