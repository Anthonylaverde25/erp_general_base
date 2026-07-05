import { describe, it, expect } from 'vitest';
import FuseUtils from './FuseUtils';

describe('FuseUtils.hasPermission', () => {
	it('should allow access if authArr is null or undefined (public route)', () => {
		expect(FuseUtils.hasPermission(undefined, 'admin')).toBe(true);
		expect(FuseUtils.hasPermission(null, 'admin')).toBe(true);
		expect(FuseUtils.hasPermission(undefined, null)).toBe(true);
	});

	it('should handle onlyGuest config: allow guest (null, undefined, or empty array)', () => {
		expect(FuseUtils.hasPermission([], null)).toBe(true);
		expect(FuseUtils.hasPermission([], undefined)).toBe(true);
		expect(FuseUtils.hasPermission([], [])).toBe(true);
	});

	it('should handle onlyGuest config: deny authenticated users', () => {
		expect(FuseUtils.hasPermission([], 'admin')).toBe(false);
		expect(FuseUtils.hasPermission([], ['user'])).toBe(false);
	});

	it('should allow any authenticated user if authArr contains wildcard "*"', () => {
		expect(FuseUtils.hasPermission(['*'], 'admin')).toBe(true);
		expect(FuseUtils.hasPermission(['*'], 'cajero')).toBe(true);
		expect(FuseUtils.hasPermission(['*'], 'any_dynamic_role')).toBe(true);
		expect(FuseUtils.hasPermission(['*'], ['multiple', 'roles'])).toBe(true);
	});

	it('should allow any authenticated user if authArr is wildcard string "*"', () => {
		expect(FuseUtils.hasPermission('*', 'admin')).toBe(true);
		expect(FuseUtils.hasPermission('*', 'supervisor')).toBe(true);
		expect(FuseUtils.hasPermission('*', ['cajero'])).toBe(true);
	});

	it('should deny guest if authArr is wildcard "*" or ["*"]', () => {
		expect(FuseUtils.hasPermission('*', null)).toBe(false);
		expect(FuseUtils.hasPermission('*', undefined)).toBe(false);
		expect(FuseUtils.hasPermission('*', [])).toBe(false);
		expect(FuseUtils.hasPermission(['*'], null)).toBe(false);
		expect(FuseUtils.hasPermission(['*'], undefined)).toBe(false);
		expect(FuseUtils.hasPermission(['*'], [])).toBe(false);
	});

	it('should allow access if userRole matches a role in authArr', () => {
		expect(FuseUtils.hasPermission(['admin', 'staff'], 'admin')).toBe(true);
		expect(FuseUtils.hasPermission(['admin', 'staff'], 'staff')).toBe(true);
	});

	it('should deny access if userRole does not match any role in authArr', () => {
		expect(FuseUtils.hasPermission(['admin', 'staff'], 'user')).toBe(false);
		expect(FuseUtils.hasPermission(['admin'], 'staff')).toBe(false);
	});

	it('should support userRole as an array of roles', () => {
		expect(FuseUtils.hasPermission(['admin', 'staff'], ['user', 'admin'])).toBe(true);
		expect(FuseUtils.hasPermission(['admin'], ['user', 'staff'])).toBe(false);
	});
});
