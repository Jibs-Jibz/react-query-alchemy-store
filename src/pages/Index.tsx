import { useAuthStore } from '@/store/auth';
import { Header } from '@/components/layout/Header';
import { LoginForm } from '@/components/auth/LoginForm';
import { ApiStatus } from '@/components/dashboard/ApiStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Database, Zap, Code } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://test-release-4e15b3080353.herokuapp.com';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                React Query API Integration
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Modern React app with Axios, React Query, Zustand & TypeScript
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-gradient-card border-accent/20">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">React Query</h3>
                    <p className="text-sm text-muted-foreground">
                      Powerful data fetching with caching and mutations
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-card border-accent/20">
                  <CardContent className="p-6 text-center">
                    <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Zustand Store</h3>
                    <p className="text-sm text-muted-foreground">
                      Lightweight state management with persistence
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-card border-accent/20">
                  <CardContent className="p-6 text-center">
                    <Code className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">TypeScript</h3>
                    <p className="text-sm text-muted-foreground">
                      Full type safety for API requests and responses
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <ApiStatus apiUrl={apiUrl} />
              </div>
              
              <div className="flex-1 flex justify-center">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your tasks and monitor API status
            </p>
          </div>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="api">API Status</TabsTrigger>
              <TabsTrigger value="hooks">Hooks Demo</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Your Transactions</h3>
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  New Swap
                </Button>
              </div>
              <Card className="bg-gradient-card border-accent/20">
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">
                    Crypto swap transactions will appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">API Integration</h3>
              <div className="grid gap-6">
                <ApiStatus apiUrl={apiUrl} />
                
                <Card className="bg-gradient-card border-accent/20">
                  <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Base URL</label>
                      <p className="font-mono text-sm bg-secondary/50 p-2 rounded mt-1">
                        {apiUrl}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Features</label>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>✅ Automatic token injection</li>
                        <li>✅ Token refresh handling</li>
                        <li>✅ Error interceptors</li>
                        <li>✅ TypeScript integration</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hooks" className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">API Hooks</h3>
              <div className="grid gap-4">
                <Card className="bg-gradient-card border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Available Hooks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Authentication</h4>
                        <ul className="space-y-1 ml-4">
                          <li>• <code className="bg-secondary/50 px-1 rounded">useLogin()</code> - Login mutation</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useRegister()</code> - Register mutation</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useCurrentUser()</code> - Get current user</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useLogout()</code> - Logout mutation</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useChangePassword()</code> - Change password</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useVerifyOtp()</code> - Verify OTP</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Swap Operations</h4>
                        <ul className="space-y-1 ml-4">
                          <li>• <code className="bg-secondary/50 px-1 rounded">useCreateCoinSwap()</code> - Create swap</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useCalculateRate()</code> - Calculate NGN rate</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useTransactions()</code> - Get transactions</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useTransaction(ref)</code> - Get single transaction</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useUsdRate()</code> - Get USDT rate</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Banking</h4>
                        <ul className="space-y-1 ml-4">
                          <li>• <code className="bg-secondary/50 px-1 rounded">useBankDetails()</code> - Get bank details</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useCreateBankDetails()</code> - Save bank details</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useVerifyAccount()</code> - Verify account</li>
                          <li>• <code className="bg-secondary/50 px-1 rounded">useSubmitSupport()</code> - Submit support ticket</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
