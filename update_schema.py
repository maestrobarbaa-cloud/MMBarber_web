import re

with open('prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

models = """
model ProfileRating {
  id          String   @id @default(cuid())
  raterId     String
  targetId    String
  rating      Int
  isCritical  Boolean  @default(false)
  traits      String?  // JSON string of traits
  weight      Float    @default(1.0) // Algorithmic weight
  createdAt   DateTime @default(now())

  rater       User     @relation("RatingsGiven", fields: [raterId], references: [id], onDelete: Cascade)
  target      User     @relation("RatingsReceived", fields: [targetId], references: [id], onDelete: Cascade)

  @@unique([raterId, targetId])
}
"""
if 'model ProfileRating' not in content:
    content += models

    # I also need to add the relation fields to the User model.
    user_relations = """
  ratingsGiven     ProfileRating[] @relation("RatingsGiven")
  ratingsReceived  ProfileRating[] @relation("RatingsReceived")
"""
    content = content.replace('  bugReports       BugReport[]', '  bugReports       BugReport[]' + user_relations)

with open('prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)
