# Ubuntu Virtual Machine Setup Guide Using VMware

Dear students,

For this subject, you may use an Ubuntu virtual machine to complete labs and assessments.

Please follow the instructions below based on your computer type.

Recommended Ubuntu version:

```text
Ubuntu 26.04 LTS or the latest available LTS version
```

Ubuntu Desktop can be downloaded from:

```text
https://ubuntu.com/download/desktop
```

---

# 1. Install VMware and Download the Correct Ubuntu ISO

## A. Windows Laptop

If you are using a Windows laptop, you can use one of the following VMware products:

```text
VMware Workstation Pro
```

or

```text
VMware Workstation Player
```

If you cannot find VMware Workstation Player, please use **VMware Workstation Pro**.

Download VMware Workstation Pro / VMware Workstation Player from:

```text
https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion
```

If the page redirects you to Broadcom, sign in or create a Broadcom account, then download:

```text
VMware Workstation Pro
```

For most Windows laptops, download the Ubuntu ISO for:

```text
AMD64 (Intel/AMD 64-bit architecture)
```

Go to:

```text
https://ubuntu.com/download/desktop
```

Choose:

```text
Intel or AMD 64-bit architecture
```

This is the correct ISO for most Windows laptops.

---

## B. MacBook

If you are using a MacBook, you should use:

```text
VMware Fusion
```

Download VMware Fusion from:

```text
https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion
```

If the page redirects you to Broadcom, sign in or create a Broadcom account, then download:

```text
VMware Fusion Pro
```

Before downloading Ubuntu, check whether your MacBook is an **Intel Mac** or an **Apple Silicon Mac**.

To check:

1. Click the Apple menu in the top-left corner.
2. Click **About This Mac**.
3. Look for **Processor** or **Chip**.

---

### Older Intel MacBook

If your Mac shows:

```text
Processor: Intel ...
```

then it is an Intel Mac.

Older MacBook models before late 2020 are usually Intel Macs.

For Intel MacBook, download Ubuntu Desktop from:

```text
https://ubuntu.com/download/desktop
```

Choose:

```text
AMD64 (Intel/AMD 64-bit architecture)
```

On the Ubuntu website, this may appear as:

```text
Intel or AMD 64-bit architecture
```

---

### Newer Apple Silicon MacBook

If your Mac shows:

```text
Chip: Apple M1 / M2 / M3 / M4 / M5
```

then it is an Apple Silicon Mac.

MacBook Air and MacBook Pro models from late 2020 onwards are usually Apple Silicon Macs.

For Apple Silicon MacBook, download Ubuntu Desktop from:

```text
https://ubuntu.com/download/desktop
```

Choose:

```text
ARM64 (ARM 64-bit architecture)
```

On the Ubuntu website, this may appear as:

```text
ARM 64-bit architecture
```

Important:

```text
Do not use the AMD64 / Intel-AMD ISO on an Apple Silicon Mac.
```

---

# 2. Create the Ubuntu Virtual Machine

## A. Windows: VMware Workstation Pro / Player

1. Open **VMware Workstation Pro** or **VMware Workstation Player**.
2. Click **Create a New Virtual Machine**.
3. Choose **Typical** if asked.
4. Select **Installer disc image file (ISO)**.
5. Select the Ubuntu ISO file you downloaded.
6. Choose the operating system type:

```text
Linux
Ubuntu 64-bit
```

7. Give the virtual machine a name, for example:

```text
Ubuntu-CSE3CWA
```

8. Recommended settings:

```text
Memory: 4 GB minimum, 8 GB recommended
CPU: 2 cores or more
Disk: 40 GB or more
Network: NAT
```

If your computer has **16 GB RAM or less**, allocate **4 GB RAM** to the virtual machine first to avoid slowing down your computer.

9. Start the virtual machine.
10. Follow the Ubuntu installation wizard.
11. Create your Ubuntu username and password.
12. Restart the virtual machine after installation.

---

## B. MacBook: VMware Fusion

1. Open **VMware Fusion**.
2. Click **Create a New Virtual Machine**.
3. Drag the Ubuntu ISO onto the VMware Fusion window, or choose:

```text
Install from disc or image
```

4. Select the Ubuntu ISO file you downloaded.
5. Give the virtual machine a name, for example:

```text
Ubuntu-CSE3CWA
```

6. Recommended settings:

```text
Memory: 4 GB minimum, 8 GB recommended
CPU: 2 cores or more
Disk: 40 GB or more
Network: NAT
```

If your Mac has **16 GB RAM or less**, allocate **4 GB RAM** to the virtual machine first to avoid slowing down your Mac.

7. Start the virtual machine.
8. Follow the Ubuntu installation wizard.
9. Create your Ubuntu username and password.
10. Restart the virtual machine after installation.

---

# 3. Install VMware Tools

After Ubuntu is installed, install Open VM Tools inside Ubuntu.

This helps with:

* Copy and paste between your computer and Ubuntu
* Screen resizing
* Better mouse and keyboard integration
* Better virtual machine performance

Open **Terminal** inside Ubuntu and run:

```bash
sudo apt update
sudo apt install open-vm-tools open-vm-tools-desktop -y
sudo reboot
```

After Ubuntu restarts, test copy and paste between your computer and the Ubuntu virtual machine.

---

# 4. Check Internet Connection

Your Ubuntu virtual machine must have internet access.

Inside Ubuntu, open **Terminal** and run:

```bash
ping -c 4 google.com
```

Then run:

```bash
sudo apt update
```

If the network does not work, check the VMware network setting.

Recommended network mode:

```text
NAT
```

Make sure the virtual machine network adapter is enabled and connected.

---

# 5. Install Basic Development Tools

Inside Ubuntu, open **Terminal** and run:

```bash
sudo apt update
sudo apt install git curl wget unzip build-essential -y
```

If this subject uses Node.js, also run:

```bash
sudo apt install nodejs npm -y
```

Check the installation:

```bash
git --version
node --version
npm --version
```

Note:

```text
The apt version of Node.js is acceptable for basic labs.
If a newer Node.js version is required, your lecturer will provide separate instructions.
```

---

# 6. Provided Ubuntu ISO File

I have also provided an **Ubuntu 26.04 LTS AMD64 / Intel-AMD 64-bit ISO file** for students who use:

* Windows laptops
* Intel-based Mac computers
* Intel/AMD desktop computers

You can download the provided ISO file here:

```text
https://latrobeuni.sharepoint.com/:f:/t/O365-CSE5006CSE3CWA/IgBgBsdV7RraSagkS5bMJq3gAW3p_zJ9tgNWBoogAiDHI8E?e=EanrSz
```

After downloading it, open **VMware Workstation Pro**, **VMware Workstation Player**, or **VMware Fusion**, create a new virtual machine, and select this ISO file.

Important:

```text
The provided ISO is for AMD64 / Intel-AMD 64-bit computers only.
It is suitable for most Windows laptops and older Intel MacBooks.
It is not suitable for Apple Silicon MacBooks.
```

If you are using an Apple Silicon MacBook, such as:

```text
MacBook Air M1 / M2 / M3 / M4 / M5
MacBook Pro M1 / M2 / M3 / M4 / M5
```

please download the **ARM64 / ARM 64-bit architecture** ISO directly from:

```text
https://ubuntu.com/download/desktop
```

---

# 7. Quick Checklist

Before class or assessment work, please make sure:

* Ubuntu starts successfully in VMware.
* You know your Ubuntu username and password.
* Internet works inside Ubuntu.
* Copy and paste works between your computer and Ubuntu.
* `git` is installed.
* `node` and `npm` are installed if required.
* You can open Terminal inside Ubuntu.

You are now ready to use Ubuntu for this subject.

[1]: https://blogs.vmware.com/cloud-foundation/2024/11/11/vmware-fusion-and-workstation-are-now-free-for-all-users/?utm_source=chatgpt.com "VMware Fusion and Workstation are Now Free for All Users"
