import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createBlock: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBlocks: (req: AuthRequest & Request, res: Response) => Promise<void>;
export declare const getBlock: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBlock: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBlock: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const moveBlock: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=blockController.d.ts.map