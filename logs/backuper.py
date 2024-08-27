import time
import shutil  

# Source file path  
source = './webhook.log'  

i = 1
 
while True:
    destination = f"./webhook/webhook_backup_{i}.log"
    shutil.copy(source, destination)
    i += 1
    print(f"webhook saved at [{time.ctime()}]")
    time.sleep(7200)