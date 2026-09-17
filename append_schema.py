import sys

file_path = r"c:\Users\micka\Documents\MMBarber_web\prisma\schema.prisma"
with open(file_path, "a", encoding="utf-8") as f:
    f.write('''
model UserFeedback {
  id        String   @id @default(cuid())
  userId    String?
  type      String   // 'IDEA', 'BUG'
  message   String
  status    String   @default("NEW") // NEW, REVIEWED, RESOLVED
  createdAt DateTime @default(now())

  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}
''')
print("Model appended")
