# IST-UTC Flight Time Converter

A web-based application for converting flight times between Indian Standard Time (IST) and Coordinated Universal Time (UTC), designed specifically for flight training programs.

## Features

- User Authentication System
  - Sign up with username, email and password
  - Secure login/logout functionality
  - Persistent sessions

- Time Conversion
  - Real-time IST to UTC conversion
  - Live clock display in both IST and UTC
  - Takeoff and landing time conversion
  - AM/PM format support

- Flight Training Management
  - Record trainee details (Name and UIN)
  - Track exercise types
  - Calculate flight duration automatically
  - Maintain cumulative flight hours

- Usage History
  - Detailed conversion logs
  - Edit previous entries
  - Clear history option
  - Export flight logs to Excel

## How to Use

1. **Account Setup**
   - Create a new account using the sign-up form
   - Login with your credentials

2. **Converting Times**
   - Enter takeoff time in IST format
   - Enter landing time in IST format
   - Select AM/PM for both times
   - Click convert to see UTC times

3. **Recording Flight Details**
   - Enter trainee name and UIN
   - Select exercise type (optional)
   - All conversions are automatically logged

4. **Managing History**
   - View complete flight history in tabular format
   - Edit previous entries as needed
   - Download history as Excel file
   - Clear history if required

## Technical Requirements

- Modern web browser with JavaScript enabled
- Local storage support
- SheetJS library for Excel export functionality

## Data Storage

- User data stored in browser's local storage
- Flight logs maintained per user session
- No server-side storage required

## Privacy

- All data is stored locally on the user's device
- No data is transmitted to external servers
- Session data persists until explicitly cleared

## Support

For any issues or feature requests, please create an issue in the repository.
