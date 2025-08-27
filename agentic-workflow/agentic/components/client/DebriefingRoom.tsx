'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SolutionVariant } from '@/components/client/SolutionVariant';
import { ComparisonMatrix } from '@/components/client/ComparisonMatrix';
import { useDebriefingStore } from '@/lib/store';
import { formatCost, formatDuration } from '@/lib/utils';
import { TaskVariant } from '@/types';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  GitBranch,
  Trophy,
  BarChart3,
  FileText,
  Clock,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

interface DebriefingRoomProps {
  taskId: string;
}

// Mock data for multiple solution variants
const mockVariants: TaskVariant[] = [
  {
    task_id: 'variant-1',
    summary: 'Modular JWT Implementation',
    approach_description: 'This solution uses a highly modular approach with separate JWT service classes, middleware abstraction, and comprehensive error handling. Emphasizes code reusability and maintainability.',
    metrics: {
      elapsed_time: 2400, // 40 minutes
      estimated_cost: 1850, // $18.50
      files_touched: 12,
      tests_passed: 28,
      tests_failed: 0
    },
    files_changed: [
      {
        file_path: 'src/auth/jwt-service.ts',
        change_type: 'created',
        additions: 145,
        deletions: 0,
        diff: `+export class JWTService {
+  private readonly secret: string;
+  private readonly expiresIn: string;
+
+  constructor(secret: string, expiresIn = '24h') {
+    this.secret = secret;
+    this.expiresIn = expiresIn;
+  }
+
+  async generateToken(payload: TokenPayload): Promise<string> {
+    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
+  }
+}`
      },
      {
        file_path: 'src/auth/controller.ts',
        change_type: 'modified',
        additions: 89,
        deletions: 156,
        diff: `-// Session-based authentication
-app.use(session({
-  secret: process.env.SESSION_SECRET,
-  resave: false,
-  saveUninitialized: false
-}));

+// JWT-based authentication
+const jwtService = new JWTService(process.env.JWT_SECRET);
+
+export const login = async (req: Request, res: Response) => {
+  const { email, password } = req.body;
+  const user = await authenticateUser(email, password);
+  
+  if (user) {
+    const token = await jwtService.generateToken({ userId: user.id });
+    res.json({ token, user });
+  } else {
+    res.status(401).json({ error: 'Invalid credentials' });
+  }
+};`
      },
      {
        file_path: 'src/middleware/auth.ts',
        change_type: 'modified',
        additions: 67,
        deletions: 45,
        diff: `-export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
-  if (req.session && req.session.userId) {
-    next();
-  } else {
-    res.status(401).json({ error: 'Unauthorized' });
-  }
-};

+export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
+  const token = req.headers.authorization?.replace('Bearer ', '');
+  
+  if (!token) {
+    return res.status(401).json({ error: 'No token provided' });
+  }
+  
+  try {
+    const payload = jwt.verify(token, process.env.JWT_SECRET);
+    req.user = payload;
+    next();
+  } catch (error) {
+    res.status(401).json({ error: 'Invalid token' });
+  }
+};`
      }
    ]
  },
  {
    task_id: 'variant-2',
    summary: 'Minimal JWT Refactor',
    approach_description: 'This solution takes a minimal approach, making the smallest possible changes to existing code while implementing JWT. Prioritizes quick deployment and minimal risk.',
    metrics: {
      elapsed_time: 1800, // 30 minutes
      estimated_cost: 1200, // $12.00
      files_touched: 6,
      tests_passed: 18,
      tests_failed: 2
    },
    files_changed: [
      {
        file_path: 'src/auth/controller.ts',
        change_type: 'modified',
        additions: 45,
        deletions: 89,
        diff: `-const session = require('express-session');
+const jwt = require('jsonwebtoken');

 export const login = async (req: Request, res: Response) => {
   const { email, password } = req.body;
   const user = await authenticateUser(email, password);
   
   if (user) {
-    req.session.userId = user.id;
-    res.json({ success: true, user });
+    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
+    res.json({ token, user });
   } else {
     res.status(401).json({ error: 'Invalid credentials' });
   }
 };`
      },
      {
        file_path: 'src/middleware/auth.ts',
        change_type: 'modified',
        additions: 23,
        deletions: 18,
        diff: `+const jwt = require('jsonwebtoken');

 export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
-  if (req.session && req.session.userId) {
-    next();
-  } else {
-    res.status(401).json({ error: 'Unauthorized' });
-  }
+  const token = req.headers.authorization?.replace('Bearer ', '');
+  try {
+    const decoded = jwt.verify(token, process.env.JWT_SECRET);
+    req.user = decoded;
+    next();
+  } catch {
+    res.status(401).json({ error: 'Unauthorized' });
+  }
 };`
      }
    ]
  },
  {
    task_id: 'variant-3',
    summary: 'Enterprise JWT with Refresh Tokens',
    approach_description: 'This solution implements a comprehensive JWT system with refresh tokens, role-based access control, and extensive security features. Built for enterprise-grade applications.',
    metrics: {
      elapsed_time: 3600, // 60 minutes
      estimated_cost: 2800, // $28.00
      files_touched: 18,
      tests_passed: 45,
      tests_failed: 1
    },
    files_changed: [
      {
        file_path: 'src/auth/jwt-manager.ts',
        change_type: 'created',
        additions: 234,
        deletions: 0,
        diff: `+export class JWTManager {
+  private readonly accessTokenSecret: string;
+  private readonly refreshTokenSecret: string;
+  
+  constructor() {
+    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
+    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;
+  }
+
+  async generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
+    const accessToken = jwt.sign(payload, this.accessTokenSecret, { expiresIn: '15m' });
+    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '7d' });
+    
+    // Store refresh token in database
+    await this.storeRefreshToken(payload.userId, refreshToken);
+    
+    return { accessToken, refreshToken };
+  }
+
+  async refreshAccessToken(refreshToken: string): Promise<string> {
+    const payload = jwt.verify(refreshToken, this.refreshTokenSecret);
+    const isValid = await this.validateRefreshToken(payload.userId, refreshToken);
+    
+    if (!isValid) {
+      throw new Error('Invalid refresh token');
+    }
+    
+    return jwt.sign({ userId: payload.userId }, this.accessTokenSecret, { expiresIn: '15m' });
+  }
+}`
      },
      {
        file_path: 'src/auth/rbac.ts',
        change_type: 'created',
        additions: 156,
        deletions: 0,
        diff: `+export class RoleBasedAccessControl {
+  private readonly permissions: Map<string, string[]>;
+  
+  constructor() {
+    this.permissions = new Map([
+      ['admin', ['read', 'write', 'delete', 'manage']],
+      ['editor', ['read', 'write']],
+      ['viewer', ['read']]
+    ]);
+  }
+
+  hasPermission(userRole: string, requiredPermission: string): boolean {
+    const rolePermissions = this.permissions.get(userRole) || [];
+    return rolePermissions.includes(requiredPermission);
+  }
+
+  requirePermission(permission: string) {
+    return (req: Request, res: Response, next: NextFunction) => {
+      const userRole = req.user?.role;
+      
+      if (!userRole || !this.hasPermission(userRole, permission)) {
+        return res.status(403).json({ error: 'Insufficient permissions' });
+      }
+      
+      next();
+    };
+  }
+}`
      }
    ]
  }
];

export function DebriefingRoom({ taskId }: DebriefingRoomProps) {
  const { variants, selectedVariant, setVariants, setSelectedVariant } = useDebriefingStore();
  const [viewMode, setViewMode] = useState<'variants' | 'comparison'>('variants');

  useEffect(() => {
    // Initialize with mock data
    setVariants(mockVariants);
  }, [setVariants]);

  const handleApproveVariant = async (variantId: string) => {
    const variant = mockVariants.find(v => v.task_id === variantId);
    if (variant) {
      // In production, this would merge the changes
      console.log('Approving variant:', variant.summary);
      alert(`✅ Approved: ${variant.summary}\n\nChanges would be merged to the main branch.`);
    }
  };

  const handleRequestRevisions = (variantId: string) => {
    const revisionNotes = prompt('Enter revision notes for the agents:');
    if (revisionNotes) {
      console.log('Requesting revisions for variant:', variantId, 'Notes:', revisionNotes);
      alert('📝 Revision request sent to agents');
    }
  };

  const handleDiscardAll = () => {
    if (confirm('Are you sure you want to discard all solutions? This cannot be undone.')) {
      console.log('Discarding all variants');
      alert('🗑️ All solutions discarded');
    }
  };

  const getBestVariant = () => {
    if (mockVariants.length === 0) return null;
    
    // Simple scoring: balance cost, time, and test success
    return mockVariants.reduce((best, current) => {
      const currentScore = (current.metrics.tests_passed / Math.max(current.metrics.tests_passed + current.metrics.tests_failed, 1)) * 100 
                          - (current.metrics.estimated_cost / 100) 
                          - (current.metrics.elapsed_time / 60);
      
      const bestScore = (best.metrics.tests_passed / Math.max(best.metrics.tests_passed + best.metrics.tests_failed, 1)) * 100 
                       - (best.metrics.estimated_cost / 100) 
                       - (best.metrics.elapsed_time / 60);
      
      return currentScore > bestScore ? current : best;
    });
  };

  const bestVariant = getBestVariant();

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/tasks/${taskId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Monitor
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Debriefing Room
            </h1>
            <p className="text-muted-foreground">Compare solutions and select the best approach</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="info" className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            {mockVariants.length} Solutions
          </Badge>
          {bestVariant && (
            <Badge variant="success" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Best: {bestVariant.summary}
            </Badge>
          )}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'variants' | 'comparison')}>
          <TabsList>
            <TabsTrigger value="variants" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Solution Variants
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Side-by-Side Comparison
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDiscardAll}>
            <XCircle className="w-4 h-4 mr-2" />
            Discard All
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate More
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Solutions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium">
                  {formatDuration(Math.min(...mockVariants.map(v => v.metrics.elapsed_time)))} - {formatDuration(Math.max(...mockVariants.map(v => v.metrics.elapsed_time)))}
                </div>
                <div className="text-sm text-muted-foreground">Time Range</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">
                  {formatCost(Math.min(...mockVariants.map(v => v.metrics.estimated_cost)))} - {formatCost(Math.max(...mockVariants.map(v => v.metrics.estimated_cost)))}
                </div>
                <div className="text-sm text-muted-foreground">Cost Range</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium">
                  {Math.min(...mockVariants.map(v => v.metrics.files_touched))} - {Math.max(...mockVariants.map(v => v.metrics.files_touched))}
                </div>
                <div className="text-sm text-muted-foreground">Files Modified</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="font-medium">
                  {mockVariants.reduce((acc, v) => acc + v.metrics.tests_passed, 0)} passed
                </div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {viewMode === 'variants' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {mockVariants.map((variant, index) => (
              <SolutionVariant
                key={variant.task_id}
                variant={variant}
                rank={index + 1}
                isBest={variant === bestVariant}
                isSelected={selectedVariant === variant.task_id}
                onSelect={() => setSelectedVariant(variant.task_id)}
                onApprove={() => handleApproveVariant(variant.task_id)}
                onRequestRevisions={() => handleRequestRevisions(variant.task_id)}
              />
            ))}
          </div>
        ) : (
          <ComparisonMatrix variants={mockVariants} />
        )}
      </div>
    </div>
  );
}
