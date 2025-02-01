**IST to UTC Time Converter**

**Project Overview**
This project is a web-based application designed to convert Indian Standard Time (IST) to Coordinated Universal Time (UTC). It includes a login/signup system, trainee details input, and a training session exercise selector. Users can enter their takeoff and landing times in IST and convert them to UTC. Additionally, the application logs conversion history and allows users to download their history as a file.

**Features**
- **User Authenticatio**n: Sign-in and Sign-up functionality.
- **Live Time Display**: Displays current IST and UTC time.
- **Trainee Details Input**: Fields for entering trainee name and UIN.
- **Exercise Selection**: A toggle-enabled dropdown for selecting training exercises.
- **Time Conversion**: Converts takeoff and landing times from IST to UTC.
- **History Log**: Stores past conversions and allows users to download them.
- **Logout Functionality**: Allows users to log out and return to the login screen.

## File Structure
```
project-folder/
│── index.html        # Main HTML file
│── style.css         # Stylesheet for the project
│── script.js         # JavaScript functionality
│── Flytutor logo.png # Logo used in the header
```

## Dependencies
- **SheetJS (xlsx.js)**: Used for exporting history data to a downloadable file.
- **Font Awesome (for icons)**: Used for the download button.

## Installation & Usage
1. Clone or download the repository.
2. Open `index.html` in a browser.
3. Use the login/signup to access the main converter interface.
4. Enter the trainee details and select an exercise if needed.
5. Input takeoff and landing times in IST and convert them to UTC.
6. View the history log and download it if required.

## How It Works
- **Login/Signup**: Users input credentials to access the converter.
- **IST to UTC Conversion**: The conversion function calculates UTC by subtracting 5 hours and 30 minutes from IST.
- **Exercise Selection**: The dropdown is enabled only if the toggle switch is turned on.
- **History Log**: Previous conversions are stored in local storage and displayed.
- **Downloading History**: Users can download their past conversions using the `Download History` button.

## Future Enhancements
- Implement backend authentication for better security.
- Enhance UI/UX with better animations and responsiveness.
- Add support for multiple time zones.

## Credits
- **Developed by**: [Your Name]
- **Logo**: Flytutor

## License
This project is open-source and free to use under the MIT License.


