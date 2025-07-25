// lib/types/apiTypes.ts (o en el mismo archivo si prefieres)
import { NextResponse } from 'next/server';
import { ServiceResponse } from './productTypes';


export type ApiResponse<T> = NextResponse<ServiceResponse<T>>;