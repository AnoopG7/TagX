import { type ReactNode } from 'react';
import {
  Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Tabs, TabsList, TabsTrigger, Input,
} from '@/components/ui';
import {
  DeviceCard, AIInsightCard, PrivacyAlertCard, SecurityStatusCard,
  TrackingStatusBadge, BatteryIndicator, SignalStrengthIndicator,
  ActivityTimeline, SmartNotification, DeviceHealthWidget,
  DeviceLocationCard, FamilyMemberCard,
} from '@/components/tagx';
import {
  StatCard, MetricCard, AnalyticsCard, EmptyState, LoadingState,
} from '@/components/dashboard';
import { Logo, Loader, FeatureCard, TestimonialCard } from '@/components/common';
import { Shield, Zap, Bell, MapPin, Activity } from 'lucide-react';
import type { TimelineEvent } from '@/components/tagx';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-20 last:mb-0">
      <h2 className="font-display text-2xl font-bold text-foreground mb-8 tracking-tight">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function DemoArea({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-card p-6 sm:p-8 ring-1 ring-foreground/10 ${className || ''}`}>{children}</div>;
}

const mockEvents: TimelineEvent[] = [
  { id: '1', type: 'location', title: 'Location Updated', description: 'TagX Pro spotted at Orion Mall, Bangalore', timestamp: '2m ago', icon: 'map-pin' },
  { id: '2', type: 'connection', title: 'Reconnected', description: 'Bluetooth reconnected after being out of range', timestamp: '15m ago', icon: 'bluetooth' },
  { id: '3', type: 'alert', title: 'Geofence Alert', description: 'TagX Slim left Home zone', timestamp: '1h ago', icon: 'alert' },
  { id: '4', type: 'status', title: 'Firmware Updated', description: 'v2.4.1 installed successfully', timestamp: '2h ago', icon: 'power' },
];

export default function ShowcasePage() {

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-14">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">Design System</h1>
          <p className="text-lg text-muted-foreground">TagX component library &mdash; dark theme</p>
        </div>

        <Section title="Color Palette">
          <DemoArea>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Page BG', hsl: '222 47% 6%', swatch: 'bg-background' },
                { name: 'Surface', hsl: '220 40% 11%', swatch: 'bg-card' },
                { name: 'Muted', hsl: '220 14% 96%', swatch: 'bg-muted' },
                { name: 'Muted/50', hsl: '220 14% 96%', swatch: 'bg-muted/50' },
                { name: 'Primary', hsl: '166 100% 42%', swatch: 'bg-primary' },
                { name: 'AI', hsl: '248 96% 68%', swatch: 'bg-ai' },
                { name: 'Warning', hsl: '38 100% 64%', swatch: 'bg-warning' },
                { name: 'Danger', hsl: '353 100% 68%', swatch: 'bg-destructive' },
              ].map((c) => (
                <div key={c.name} className="p-3 rounded-lg bg-muted border">
                  <div className={`w-full h-14 rounded-md mb-2 shadow-sm ${c.swatch}`} />
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{c.hsl}</p>
                </div>
              ))}
            </div>
          </DemoArea>
        </Section>

        <Section title="shadcn/ui">
          <DemoArea>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Button</p>
            <div className="flex flex-wrap items-start gap-3 mb-6">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Input</p>
            <div className="max-w-xs mb-6">
              <Input placeholder="Search devices..." />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Badge</p>
            <div className="flex flex-wrap items-start gap-3 mb-6">
              <Badge variant="active">Active</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="ai">AI</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="ghost">Ghost</Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Tabs</p>
            <div className="max-w-sm mb-6">
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Devices</TabsTrigger>
                  <TabsTrigger value="tab2">Alerts</TabsTrigger>
                  <TabsTrigger value="tab3">Insights</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Card</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card>
                <CardHeader><CardTitle>Default</CardTitle><CardDescription>Standard card with shadow</CardDescription></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Ring-based card with hover lift.</p></CardContent>
                <CardFooter><Button size="sm">Action</Button></CardFooter>
              </Card>
              <Card size="sm">
                <CardHeader><CardTitle>Compact</CardTitle><CardDescription>Reduced padding</CardDescription></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Tighter spacing for dense layouts.</p></CardContent>
                <CardFooter><Button size="xs">Action</Button></CardFooter>
              </Card>
            </div>
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Device Card">
          <DemoArea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DeviceCard name="TagX Pro" type="tag" status="active" batteryLevel={82} signalStrength={75} lastSeen="2m ago" location="Orion Mall" accuracy="5m" />
              <DeviceCard name="iPhone 15" type="phone" status="active" batteryLevel={34} signalStrength={90} lastSeen="Now" location="Home" />
              <DeviceCard name="Wallet Tag" type="wallet" status="idle" batteryLevel={67} signalStrength={45} lastSeen="1h ago" />
              <DeviceCard name="Max (Pet)" type="pet" status="offline" batteryLevel={8} signalStrength={0} lastSeen="3h ago" location="Unknown" />
            </div>
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; AI Insights">
          <DemoArea className="space-y-4">
            <AIInsightCard type="insight" title="Pattern Detected" description="You tend to leave your keys in the living room between 6-8 PM. Check the couch." confidence={0.87} timestamp="5m ago" actionable />
            <AIInsightCard type="prediction" title="Battery Forecast" description="TagX Pet battery predicted to last 12 more days based on current usage." confidence={0.94} timestamp="1h ago" />
            <AIInsightCard type="alert" title="Unusual Activity" description="Wallet Tag moved outside your usual zone during work hours." timestamp="30m ago" actionable />
            <AIInsightCard type="suggestion" title="Optimize Placement" description="Moving your TagX Pro closer to the entrance improves signal by 40%." confidence={0.78} timestamp="2h ago" />
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Privacy Alerts">
          <DemoArea className="space-y-4">
            <PrivacyAlertCard severity="info" title="Privacy Scan Complete" description="No unknown trackers detected in your vicinity. Your area is secure." timestamp="10m ago" />
            <PrivacyAlertCard severity="warning" title="Unknown Tracker Detected" description="An unknown device has been following your route for 15 minutes." location="MG Road, Bangalore" timestamp="5m ago" actionLabel="Investigate" />
            <PrivacyAlertCard severity="critical" title="Anti-Stalking Alert" description="A tracker not in your network has been consistently near you for 30+ minutes." location="Indiranagar" timestamp="2m ago" actionLabel="Scan Now" />
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Security Status">
          <DemoArea>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <SecurityStatusCard status="secure" devicesProtected={8} alertsToday={0} lastScan="2m ago" />
              <SecurityStatusCard status="warning" devicesProtected={5} alertsToday={3} lastScan="15m ago" />
              <SecurityStatusCard status="compromised" devicesProtected={3} alertsToday={7} lastScan="1h ago" encryptionEnabled={false} />
            </div>
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Tracking Status Badge">
          <DemoArea>
            <div className="flex flex-wrap items-start gap-4">
              <TrackingStatusBadge status="active" />
              <TrackingStatusBadge status="idle" />
              <TrackingStatusBadge status="offline" />
              <TrackingStatusBadge status="low_battery" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">Sizes:</p>
            <div className="flex flex-wrap items-start gap-4 mt-2">
              <TrackingStatusBadge status="active" size="sm" />
              <TrackingStatusBadge status="active" />
            </div>
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Indicators">
          <DemoArea>
            <div className="space-y-5 max-w-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Battery Levels</p>
                <div className="space-y-3">
                  <BatteryIndicator level={85} />
                  <BatteryIndicator level={45} />
                  <BatteryIndicator level={12} />
                  <BatteryIndicator level={100} charging />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Signal Strength</p>
                <div className="space-y-3">
                  <SignalStrengthIndicator strength={90} showLabel />
                  <SignalStrengthIndicator strength={55} showLabel />
                  <SignalStrengthIndicator strength={20} showLabel />
                  <SignalStrengthIndicator strength={0} showLabel />
                </div>
              </div>
            </div>
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Activity Timeline">
          <DemoArea className="max-w-lg">
            <ActivityTimeline events={mockEvents} />
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Smart Notifications">
          <DemoArea className="space-y-3 max-w-lg">
            <SmartNotification type="location" title="TagX Pro Found" description="Located at Orion Mall, Sector 3 — within your safe zone." timestamp="2m ago" actionable />
            <SmartNotification type="security" title="New Device Paired" description="AirPods Pro added to your network. Encryption enabled." timestamp="15m ago" read />
            <SmartNotification type="insight" title="Weekly Report Ready" description="You saved 23 minutes this week by not searching for items." timestamp="1h ago" read />
            <SmartNotification type="reminder" title="Battery Reminder" description="Wallet Tag battery is below 20%. Consider replacing." timestamp="3h ago" actionable />
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Device Health">
          <DemoArea className="max-w-sm">
            <DeviceHealthWidget uptime={99.8} signalStrength={76} batteryHealth={92} temperature={36.2} lastCalibrated="2 days ago" firmwareVersion="2.4.1" />
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Device Location">
          <DemoArea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DeviceLocationCard deviceName="TagX Pro" address="Orion Mall, Brigade Road, Bangalore" coordinates={{ lat: 12.9716, lng: 77.5946 }} lastUpdated="2m ago" accuracy="5m" isMoving />
              <DeviceLocationCard deviceName="Wallet Tag" address="Home — Living Room" coordinates={{ lat: 12.9344, lng: 77.6101 }} lastUpdated="1h ago" accuracy="2m" />
            </div>
          </DemoArea>
        </Section>

        <Section title="TagX &mdash; Family Members">
          <DemoArea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FamilyMemberCard name="Ananya" role="Owner" devices={4} status="active" location="Home" isOwner />
              <FamilyMemberCard name="Rahul" role="Partner" devices={2} status="active" location="Work" />
              <FamilyMemberCard name="Priya" role="Child" devices={1} status="idle" location="School" />
              <FamilyMemberCard name="Dad" role="Parent" devices={3} status="offline" location="Unknown" />
            </div>
          </DemoArea>
        </Section>

        <Section title="Dashboard &mdash; Stat Cards">
          <DemoArea>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <StatCard label="Devices Tracked" value="12" icon={Shield} trend={{ value: 8, positive: true }} />
              <StatCard label="Alerts Today" value="3" icon={Bell} trend={{ value: 12, positive: false }} variant="primary" />
              <StatCard label="AI Insights" value="24" icon={Zap} trend={{ value: 32, positive: true }} variant="ai" />
              <StatCard label="Active Zones" value="5" icon={MapPin} variant="default" />
            </div>
          </DemoArea>
        </Section>

        <Section title="Dashboard &mdash; Metric Cards">
          <DemoArea>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <MetricCard label="Uptime" value="99.8%" sublabel="Last 30 days" progress={99.8} />
              <MetricCard label="Signal Coverage" value="94%" sublabel="Average strength" progress={94} progressColor="ai" />
              <MetricCard label="Battery Health" value="87%" sublabel="Fleet average" progress={87} progressColor="warning" />
            </div>
          </DemoArea>
        </Section>

        <Section title="Dashboard &mdash; Analytics Card">
          <DemoArea>
            <AnalyticsCard title="Tracking Activity" description="Last 7 days" headerAction={<Badge variant="outline" className="text-[10px]">+18%</Badge>}>
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-sm bg-primary/15" style={{ height: `${h}%` }}>
                      <div className="w-full h-full rounded-sm bg-primary transition-all duration-500" style={{ height: `${h}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">M{i + 1}</span>
                  </div>
                ))}
              </div>
            </AnalyticsCard>
          </DemoArea>
        </Section>

        <Section title="Dashboard &mdash; States">
          <DemoArea className="space-y-6">
            <EmptyState
              icon={Activity}
              title="No devices found"
              description="Add your first tracking device to start monitoring."
              action={<Button size="sm">Add Device</Button>}
            />
            <LoadingState text="Loading devices..." />
            <LoadingState variant="skeleton" count={3} />
          </DemoArea>
        </Section>

        <Section title="Common Components">
          <DemoArea className="space-y-6">
            <div className="flex flex-wrap items-start gap-8">
              <Logo size="sm" />
              <Logo size="default" />
              <Logo size="lg" />
            </div>
            <Loader text="Loading..." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon={Shield} title="Secure" description="End-to-end encryption." accent="cyan" />
              <FeatureCard icon={Zap} title="Fast" description="Real-time tracking." accent="cyan" />
              <FeatureCard icon={Bell} title="Alerts" description="Instant notifications." accent="warm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <TestimonialCard name="Ananya S." role="Early Adopter" content="TagX saved me hours of searching." rating={5} />
              <TestimonialCard name="Rahul M." role="Pet Owner" content="The pet tracker gives me peace of mind." rating={4} />
            </div>
          </DemoArea>
        </Section>
      </div>
    </div>
  );
}
