import { StatusOrderEnum } from "../helpers/interfaces";

export interface ICreateOrderService {
	responsible: string;
	size: number;
	files: File[];
}

export interface IGetOrderByBatchIdService {
	batchId: string;
}

export interface IUpdateOrderByBatchIdService {
	batchId: string;
	responsible?: string;
	status?: StatusOrderEnum;
}

export interface IUpdateTicketURLByBatchIdService {
	batch: string;
	ticketURL?: string;
	status?: StatusOrderEnum;
}

export interface OrderViewModel {
	batchId: string;
	responsible: string;
	status: string;
	size: number;
	lastUpdate: Date;
	files: string[];
}
