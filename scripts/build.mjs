import { spawnSync } from 'child_process';
import os from 'os';

let command = 'npx';
let args = ['cross-env', 'NODE_OPTIONS=--max-old-space-size=1536', 'next', 'build'];

// If running on Linux (which is what aaPanel uses), we forcefully restrict 
// the CPU affinity of this process and all its children (Turbopack, SWC, Node)
// to just 2 cores (0 and 1). This effectively caps CPU usage at 25% on an 8-core system,
// completely bypassing the aaPanel "100% CPU Abuse" kill switch.
if (os.platform() === 'linux') {
  console.log('Linux OS detected: Applying OS-level CPU affinity (taskset) to restrict build to 2 cores. This prevents the aaPanel anti-abuse kill switch.');
  command = 'taskset';
  args = ['-c', '0,1', 'npx', 'cross-env', 'NODE_OPTIONS=--max-old-space-size=1536', 'next', 'build'];
} else {
  console.log('Non-Linux OS detected: Running normal unrestricted build.');
}

console.log(`Executing: ${command} ${args.join(' ')}`);

const result = spawnSync(command, args, { stdio: 'inherit' });

if (result.error || result.status !== 0) {
  // If taskset is not installed on the Linux system, gracefully fallback to the normal command
  if (result.error && result.error.code === 'ENOENT' && command === 'taskset') {
    console.warn('taskset command not found on this system! Falling back to normal unrestricted build...');
    const fallback = spawnSync('npx', ['cross-env', 'NODE_OPTIONS=--max-old-space-size=1536', 'next', 'build'], { stdio: 'inherit' });
    process.exit(fallback.status || 0);
  }
  
  process.exit(result.status || 1);
}
