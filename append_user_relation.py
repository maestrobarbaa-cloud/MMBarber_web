# -*- coding: utf-8 -*-
import sys

file_path = r"c:\Users\micka\Documents\MMBarber_web\prisma\schema.prisma"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = "  bugReports           BugReport[]\n"
replacement = target + "  userFeedbacks        UserFeedback[]\n"

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("User relation added")
else:
    print("Could not find bugReports array in User model")
