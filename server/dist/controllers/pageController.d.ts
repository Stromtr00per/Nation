import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createPage: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPages: (req: AuthRequest & Request, res: Response) => Promise<void>;
export declare const getPage: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePage: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePage: (req: AuthRequest & Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=pageController.d.ts.map