import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Globe, Zap } from 'lucide-react';
import api from '@/lib/axios';

interface ApiStatusProps {
  apiUrl: string;
}

export const ApiStatus = ({ apiUrl }: ApiStatusProps) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const checkApiStatus = async () => {
    setStatus('checking');
    const startTime = Date.now();
    
    try {
      await api.get('/health');
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setStatus('online');
    } catch (error) {
      setResponseTime(null);
      setStatus('offline');
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkApiStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    switch (status) {
      case 'online':
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            <div className="w-2 h-2 rounded-full bg-success mr-2" />
            Online
          </Badge>
        );
      case 'offline':
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <div className="w-2 h-2 rounded-full bg-destructive mr-2" />
            Offline
          </Badge>
        );
      case 'checking':
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <div className="w-2 h-2 rounded-full bg-warning mr-2 animate-pulse" />
            Checking
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-gradient-card border-accent/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          API Status
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={checkApiStatus}
          disabled={status === 'checking'}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Endpoint</span>
            <span className="text-sm font-mono text-primary truncate max-w-48">
              {apiUrl}
            </span>
          </div>
          
          {responseTime && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <div className="flex items-center">
                <Zap className="h-3 w-3 mr-1 text-primary" />
                <span className="text-sm font-medium">
                  {responseTime}ms
                </span>
              </div>
            </div>
          )}
          
          {lastChecked && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Checked</span>
              <span className="text-sm">
                {lastChecked.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};