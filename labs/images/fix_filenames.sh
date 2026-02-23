#!/bin/bash
# 폴더 및 파일명 공백 제거
# 사용: 터미널에서 ./fix_filenames.sh 실행

cd "$(dirname "$0")"
LOG="$(pwd)/_rename_log.txt"
echo "시작 $(date)" > "$LOG"

# InteractiveAnalogClock 내 파일명 공백 제거
if [ -d "InteractiveAnalogClock" ]; then
  cd InteractiveAnalogClock
  find . -maxdepth 1 -type f -name "*Details*.png" | while read -r f; do
    f="${f#./}"
    new=$(echo "$f" | tr -d ' ')
    if [ "$f" != "$new" ] && [ -n "$new" ]; then
      mv -- "$f" "$new" 2>>"$LOG" && echo "Renamed: $f -> $new" >> "$LOG"
    fi
  done
  cd ..
fi

# Trending Searches, Lab 3, Lab 4 폴더명 변경
for dir in "Trending Searches" "Lab 3" "Lab 4"; do
  if [ -d "$dir" ]; then
    new="${dir// /}"
    mv -- "$dir" "$new" 2>>"$LOG" && echo "Folder: $dir -> $new" >> "$LOG"
  fi
done

echo "완료 $(date)" >> "$LOG"
