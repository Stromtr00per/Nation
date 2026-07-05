import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createWorkspace: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getWorkspaces: (req: AuthRequest & Request, res: Response) => Promise<void>;
export declare const getWorkspace: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateWorkspace: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteWorkspace: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const inviteMember: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeMember: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=workspaceController.d.ts.map