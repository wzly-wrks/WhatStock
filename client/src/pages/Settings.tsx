import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, Palette } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your WhatStock preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle>Export Settings</CardTitle>
            </div>
            <CardDescription>Configure default export formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Default Export Format</Label>
              <Input
                id="export-format"
                value="Whatnot CSV"
                disabled
                data-testid="input-export-format"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="include-images">Include Image URLs in Export</Label>
                <p className="text-sm text-muted-foreground">Add image URLs to exported files</p>
              </div>
              <Switch id="include-images" defaultChecked data-testid="switch-include-images" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>Manage your inventory data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" data-testid="button-export-data">
                Export All Data
              </Button>
              <Button variant="outline" data-testid="button-import-data">
                Import Data
              </Button>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Danger Zone</p>
              <Button variant="destructive" data-testid="button-clear-data">
                Clear All Inventory
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Dark theme enabled by default</p>
              </div>
              <Badge variant="outline" className="bg-muted/50">Dark Mode</Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="card-density">Card Density</Label>
              <input
                id="card-density"
                type="range"
                min="1"
                max="3"
                defaultValue="2"
                className="w-full accent-primary"
                data-testid="slider-card-density"
              />
              <p className="text-xs text-muted-foreground">Adjust how much information is shown on cards</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" data-testid="button-save-settings">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
