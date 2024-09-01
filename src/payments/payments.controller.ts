import { Body, Controller, Post, Req, Res, Headers, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly stripeService: PaymentsService) { }

    @Post('/create-account')
    async createAccount(@Body('email') email: string) {
        const account = await this.stripeService.createAccount(email);
        return account;
    }

    @Post('/create-checkout-session')
    async createCheckoutSession(
        @Body('amount') amount: number,
        @Body('currency') currency: string,
        @Body('accountId') accountId: string,
    ) {
        const session = await this.stripeService.createCheckoutSession(amount, currency, accountId);
        return session;
    }

    @Post('/webhook')
    async handleWebhook(
        @Req() request: Request,
        @Res() response: Response,
        @Headers('stripe-signature') signature: string
    ) {
        const rawBody = request.body; // Use the raw body for verification
        try {
            const event = this.stripeService.constructEvent(rawBody, signature);
            await this.stripeService.handleWebhookEvent(event);
            response.status(200).send();
        } catch (error) {
            console.error('Webhook Error:', error.message);
            response.status(400).send(`Webhook Error: ${error.message}`);
        }
    }

    @Get('/success')
    async scuccess(@Body() body: string) {
        return body;
    }

    @Get('/cancel')
    async cancel(@Body() body: string) {
        return body;
    }

} 