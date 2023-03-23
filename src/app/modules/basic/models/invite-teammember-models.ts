export class ActiveUser {
    userId:string;
	userEmail:string;
	role:string;
	totalCredits:number;
	availableCredits:number;
	usedCredits:number;
	createdOn:string;
	availableRecurringCredits: number;
}

export class SeatsCreditsStatus {
    totalCredits:number = 0;
	availableCredits:number=0;
	usedCredits:number = 0;
    noOfSeats:number = 0;
	availableRecurringCredits: number = 0;
}