import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailTemplateProps {
    firstName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    bookingDetails: {
        bookingId: string;
        date: string;
        time: string;
        products: {
            name: string;
            variant: string;
            quantity: number;
            amount: number;
        }[];
    };
}

export const ClientEmail: React.FC<EmailTemplateProps> = ({ firstName, bookingDetails }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Hi {firstName},</CardTitle>
                <CardDescription><meta name="description" content="" />
                    Thank you for booking with us. Your booking has been confirmed.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    Your booking has been confirmed. Here are the details:
                    <br />
                    Booking ID: {bookingDetails.bookingId}
                    <br />
                    Date: {bookingDetails.date}
                    <br />
                    Time: {bookingDetails.time}
                    <br />
                </CardDescription>
                <CardDescription>
                    You have purchased the following products:
                    <br />
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Product</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Variant</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Quantity</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingDetails.products.map((product, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.variant}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.quantity}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>KES {product.amount}</td>
                                </tr>
                            ))}
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }} colSpan={3}><strong>Total</strong></td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <strong>KES {bookingDetails.products.reduce((total, product) => total + product.amount, 0)}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardDescription>
            </CardContent>
            <CardFooter>
                <CardDescription>
                    If you have any questions, please contact us at support@houseofqacym.com or call us at +234 123 456 7890. Alternatively, you can reply to this email.
                </CardDescription>
            </CardFooter>
        </Card>
    );
};

export const AdminEmail: React.FC<EmailTemplateProps> = ({ firstName, fullName, email, phoneNumber, bookingDetails }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>New Booking</CardTitle>
                <CardDescription><meta name="description" content="" />
                    A new booking has been made.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    A new booking has been made by {firstName}. Here are the details:
                    <br />
                    Booking ID: {bookingDetails.bookingId}
                    <br />
                    Date: {bookingDetails.date}
                    <br />
                    Time: {bookingDetails.time}
                    <br />
                    Customer: {fullName}
                    <br />
                    Email: {email}
                    <br />
                    Phone Number: {phoneNumber}
                    <br />
                </CardDescription>
                <CardDescription>
                    The customer has purchased the following products:
                    <br />
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Product</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Variant</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Quantity</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingDetails.products.map((product, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.variant}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.quantity}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>KES {product.amount}</td>
                                </tr>
                            ))}
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }} colSpan={3}><strong>Total</strong></td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <strong>KES {bookingDetails.products.reduce((total, product) => total + product.amount, 0)}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardDescription>
            </CardContent>
            <CardFooter>
                <CardDescription>
                    If you have any questions, please contact the customer at {email} or call them at {phoneNumber}.
                </CardDescription>
            </CardFooter>
        </Card>
    );
};
