import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class PaymentsService {
    private stripe: Stripe;
    private webhookSecret: string;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'));
        this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    }

    async createAccount(email: string): Promise<Stripe.Account> {
        const account = await this.stripe.accounts.create({
            type: 'express',
            country: 'RO',
            email,
        });
        await this.enableTransfersCapability(account.id)
        return account;
    }

    async enableTransfersCapability(accountId: string): Promise<Stripe.Account> {
        return this.stripe.accounts.update(accountId, {
            capabilities: {
                transfers: { requested: true },
            },
        });
    }

    async createCheckoutSession(amount: number, currency: string, accountId: string): Promise<Stripe.Checkout.Session> {
        let amountInSmallestUnit: number;

        if (currency === 'ron') {
            // Convert RON to bani (1 RON = 100 bani)
            amountInSmallestUnit = amount * 100;
        }

        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: 'Product Name',
                        },
                        unit_amount: amountInSmallestUnit,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',


            success_url: 'http://localhost:3000/payments/success',
            cancel_url: 'http://localhost:3000/payments/cancel',
        });
    }

    constructEvent(payload: Buffer, sig: string): Stripe.Event {
        return this.stripe.webhooks.constructEvent(payload, sig, this.webhookSecret);
    }

    async handleWebhookEvent(event: Stripe.Event) {
        console.log(event)
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`PaymentIntent was successful! ID: ${paymentIntent.id}`);
                break;
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                console.log(`Checkout Session completed! Session ID: ${session.id}`);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}