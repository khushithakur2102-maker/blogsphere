import * as icons from 'lucide-react';

const needed = [
  'SquarePen', 'LogOut', 'User', 'ArrowLeft', 'ArrowRight', 'Loader2',
  'Mail', 'Lock', 'Settings', 'Calendar', 'MessageSquare', 'Pencil', 'Trash2',
  'Save', 'X', 'Plus', 'Hash', 'Tag', 'Send'
];

needed.forEach(name => {
  if (!icons[name]) {
    console.log(`MISSING ICON: ${name}`);
  }
});
console.log('Icon check complete.');
