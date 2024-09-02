import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

export async function generateMigration(name: string) {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
  const filename = `${timestamp}_${name}.sql`;
  const path = join(process.cwd(), 'migrations', filename);

  await writeFile(path, '-- Write your migration SQL here\n');
  console.log(`Generated migration: ${filename}`);
}

export async function runMigrations() {
  try {
    const { stdout, stderr } = await execAsync('goose up');
    console.log('Migration output:', stdout);
    if (stderr) console.error('Migration errors:', stderr);
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}