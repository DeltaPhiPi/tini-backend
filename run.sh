#!/bin/sh
while true;
do
 cargo run --release || echo "App crashed... restarting..." >&2
 echo "Press Ctrl-C to quit." && sleep 1
done
