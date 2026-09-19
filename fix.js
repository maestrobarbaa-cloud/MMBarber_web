const fs = require('fs');
const file = 'prisma/schema.prisma';
const content = fs.readFileSync(file, 'utf8');
const idx = content.indexOf('model CooperationRequest {');
if (idx === -1) process.exit(1);

const base = content.substring(0, idx);
const rest = `model CooperationRequest {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  field     String
  message   String
  status    String   @default("NEW") // NEW, IN_PROGRESS, COMPLETED, REJECTED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CommunityProject {
  id         String   @id @default(cuid())
  title      String
  status     String   @default("PREPARING") // ONLINE, OFFLINE, MAINTENANCE, PREPARING
  tag        String   @default("GENERAL")
  desc       String
  descEn     String?
  dateLabel  String?
  icon       String   @default("Folder") // Lucide icon name
  link       String?
  details    String?  // JSON string
  isApproved Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
`;
fs.writeFileSync(file, base + rest);
console.log("Fixed schema.prisma");
