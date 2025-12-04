import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';

const shippingRates = [
  { id: 1, region: 'United States', rate: '$5.00', estimatedDays: '3-5 days' },
  { id: 2, region: 'Canada', rate: '$10.00', estimatedDays: '5-7 days' },
  { id: 3, region: 'Europe', rate: '$15.00', estimatedDays: '7-10 days' },
  { id: 4, region: 'Asia', rate: '$20.00', estimatedDays: '10-14 days' },
];

export default function Shipping() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shipping</h1>
          <p className="text-muted-foreground">Manage shipping regions and rates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Region
        </Button>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Estimated Delivery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shippingRates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.region}</TableCell>
                <TableCell>{rate.rate}</TableCell>
                <TableCell>{rate.estimatedDays}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
