import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from 'class-validator';
import { code } from 'currency-codes';

export function IsCurrencyCode(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsCurrencyCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && !!code(value);
        }
      }
    });
  };
}
