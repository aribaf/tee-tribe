import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const payments = [
  { id: 'PAY-001', method: 'Credit Card', amount: '$250.00', status: 'Completed', date: '2024-01-15' },
  { id: 'PAY-002', method: 'PayPal', amount: '$180.00', status: 'Completed', date: '2024-01-16' },
  { id: 'PAY-003', method: 'COD', amount: '$320.00', status: 'Pending', date: '2024-01-17' },
  { id: 'PAY-004', method: 'Credit Card', amount: '$150.00', status: 'Completed', date: '2024-01-18' },
];

export default function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">View and manage transactions</p>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    payment.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>{payment.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
