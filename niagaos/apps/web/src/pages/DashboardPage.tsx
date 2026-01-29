import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@niagaos/ui';

export function DashboardPage() {
    const { vertical, tenant, mode } = useParams();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-lg">🚀</span>
                    </div>
                    <div>
                        <h1 className="font-semibold">{tenant}</h1>
                        <p className="text-sm text-muted-foreground capitalize">{vertical} / {mode}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">1,234</div>
                            <p className="text-xs text-green-500">+12% from last week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">$45,231</div>
                            <p className="text-xs text-green-500">+8% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">892</div>
                            <p className="text-xs text-muted-foreground">This week</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to NIAGAOS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            You are viewing the <strong className="text-foreground">{vertical}</strong> vertical
                            for tenant <strong className="text-foreground">{tenant}</strong> in
                            <strong className="text-foreground"> {mode}</strong> mode.
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
