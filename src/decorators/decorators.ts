import { Request, Response } from 'express'

function authenticate(target: Object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const req = args[0] as Request
        const res = args[1] as Response
        if (req.session.email) {
            return original.apply(this, args);   
        }
        res.status(401).json('Unauthorized access');
    }
}

export { authenticate };