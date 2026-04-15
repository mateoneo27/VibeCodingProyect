/**
 * One-time script to create the admin user in Supabase Auth
 * and insert the admin role into the public.users table.
 *
 * Usage:
 *   node scripts/create-admin.mjs
 *
 * Then enter the password when prompted.
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const SUPABASE_URL = 'https://wgjhkqjvtbmftljtcoiy.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnamhrcWp2dGJtZnRsanRjb2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzY4NzksImV4cCI6MjA5MTI1Mjg3OX0.edLacl_pCf0bibJQpr6Fj1ZQpWVX2IT3rvf6A18mWoc';

const ADMIN_EMAIL = 'admin@neo.com.pe';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const rl = readline.createInterface({ input, output });
const password = await rl.question('Enter password for admin@neo.com.pe: ');
rl.close();

if (!password || password.length < 6) {
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}

console.log('\nCreating Supabase Auth user...');
const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email: ADMIN_EMAIL,
  password,
});

if (signUpError) {
  console.error('Auth signup failed:', signUpError.message);
  process.exit(1);
}

const user = signUpData.user;
if (!user) {
  console.error('No user returned from signUp. The account may already exist.');
  process.exit(1);
}

console.log(`Auth user created: ${user.id}`);

console.log('Inserting admin role into public.users...');
const { error: dbError } = await supabase
  .from('users')
  .upsert({ id: user.id, email: ADMIN_EMAIL, role: 'admin' });

if (dbError) {
  console.error('DB insert failed:', dbError.message);
  process.exit(1);
}

console.log('\nAdmin user created successfully!');
console.log('Email:', ADMIN_EMAIL);
console.log('Role:  admin');
console.log('\nIf Supabase requires email confirmation, go to:');
console.log('  Authentication > Users > find admin@neo.com.pe > confirm manually');
console.log('  OR disable email confirmation in Authentication > Settings > Email.');
