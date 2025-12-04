import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CMS() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage website content and pages</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Homepage</h3>
          <p className="text-sm text-muted-foreground mb-4">Main landing page</p>
          <Button variant="outline" size="sm">Edit</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">About Us</h3>
          <p className="text-sm text-muted-foreground mb-4">Company information</p>
          <Button variant="outline" size="sm">Edit</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm text-muted-foreground mb-4">Contact form page</p>
          <Button variant="outline" size="sm">Edit</Button>
        </Card>
      </div>
    </div>
  );
}
