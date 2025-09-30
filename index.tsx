/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// FIX: Import from the package name directly, not from a CDN URL.
import { GoogleGenAI, Type } from "@google/genai";

declare const Chart: any; // To inform TypeScript about the global Chart object from the CDN

// Fix: Add ptfApp to the global window interface to resolve TypeScript error.
declare global {
    interface Window {
        ptfApp: PTFUIController;
    }
}

// Database simulation using localStorage
class PTFDatabase {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize default data if not exists
        if (!localStorage.getItem('ptfData')) {
            const defaultData = {
                users: [
                    { id: 1, name: "Waseem Ahmed", email: "admin@ptf.org", password: "admin123", role: "Admin", avatar: "https://pakistantaekwondo.com/wp-content/uploads/2025/03/WhatsApp-Image-2023-08-30-at-5.28.58-PM-470x503-1.webp" },
                    { id: 2, name: "Ali Hassan", email: "user@ptf.org", password: "user123", role: "User", avatar: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA5AEUDASIAAhEBAxEB/8QAGwAAAgIDAQAAAAAAAAAAAAAAAAQDBQECBgf/xAApEAACAgEDAwQCAAcAAAAAAAABAgMRBAAFIRIxBgcUIkFRYTJCcYGR/8QAGQEAAgMBAAAAAAAAAAAAAAAAAQIAAwQF/8QAHBEAAgIDAQEBAAAAAAAAAAAAAAECEQMSIUFR/9oADAMBAAIRAxEAPwA94x4z7e4Lkt3sXk8rDhY8jO82NFCqH6A9qgkAXfI386r+p8v4o7m5bDx4r5PZ8JdY4VjjjVnUAgX2qBf8AOj5P6B7RzZ8+dJgSR5E7PKyzyqCxJJIAahqa33F/SPtnsc8WS+I+RkRkNGeWRmAPyFJAP86d5eNq0JcbklbOWnC8tJ25BmMqS+4q3zY1x4eG3uLkg5D0zI6dI9Xy51AegXg6t0VlF9x3189WzL6N+0mflvn5OBMs0jF2CzyKorckKDQH40rA/RD2kwc5M6HBlaaNw6GSaRlBHqFJAP86T5OOrQvjyblbPNI3T5/x8i7Mv5e5uJjR4se3TQRRKEQCfI4A4A9XfUvYfUf4p7e5uPCy+GzJc+YdMcaSxks3wAd6Pmv0X9p8nKky5sCVppWLsTPJ1J5J4ah+dH7P8Aop7U7BmxZjcLK0sLB0LzyEAg1yA1HjSeXjStDw5N27PoHdvWbL6g+4k+3PimLms/gM7NlSxh1VZIwELAgMDZ+Dob6H0aP2z+nPZ/x53fF38GfFzJ4g8qK8iG3F2AwJ8jx8a1W/0c9psl2kkwJFZiWYLNIoJPyA0lJ7K9J+ye18mPJixJlkjbqjMsrUfoQSPzpnlxq0T48r3bMLM/mP7nwcbFjY/dsWDFiQRgKiI+QqqByAAz8DWN3D6k/FHbXIx4ef4XNkTTsEjVI5lLMfQAn50nM/Qz2aypHlk36YyMSzESSCyeTxzWp3f6M+1G9TwyZOFMk8C9EcU8iMB8CQefzqfLx/oeHL+j6J67y8D1D70x+3fwph71m8TmsuXJjEio8asqMoIKkMfUEGtaH04dn4/D3cR+G8f8M2QZjGrSgGQgergnkAf417TfRh2lyFZZMDIdT6iWRv/wC9C7N+irtrsmfHlxYGQ0UTBwkksjBh8GBNA8f6T4cv7Po/cPe2v3b1L7gyO2fD2Dkc/gMDLlzzxh0CyRBSrAgqwYnng6Hk/oz7TZjM02BIrMSxCzyKCSeTwah+dfSvhP049ndg7h/iLD4jJjzBKZV1SSMiuSSSAx9CTp3lxsT48rF2v1z2Vn+vHuV+H+z8Hi87PlSYxkKpJGCqkEEEFifYnXrf8AQx2Zdi7b9MSxJI8kgk8n11od7+jTtPkSPJJgSszksQs8igk+wGoaUex/Rj2v2nJjyxYEoaJg6h5ZHBHyINA8f6T4cj6j7/AO7+re3M/uP3N2z4cwclM3BwZc2bJCESJHIqlXBBUgsfYkaPkb6ce0D+J38Q+FZD55m8wyl5Sdfu9ev241bM36N+0+RI8kmBKSxJISaRQD8gGoaUexfRf2s2nNjzRYEwMTBwHlkcEj2INA8f6T4ch9w+8er/ALs6jdxO3vCWJnsnhM1lS5DxkqjxqyqykEEEEn1A19D+F/TT2c2buP+I8PEyIs8SmVdUsjIrEkkgMfYk/zrWzb6Me02RI8kmBIzMSzBZ5FBJ9gGoaB7H9F/a7acyPNiwJv3TEOA8sjgj2INA8f6Pw5D7k707Q73699xIna3w9g8pncLgZc2fMiEirHJEqspBBViWPsTpEj+nD/DfxO/f8A4VknP8zzerzS9Xf3de3PGrcn6N+02RI8kmBKSxLMBLKFBPsAahpSP6L+1mBnjORYEoaNg4DSyMCCL5BNDz8f6T4cj6g713P3j1/8AE2b3D3F234cwclM3Bwp82bJCI0SOVUKsCCrFj7AnRvjP0z9n83uv/ABE+NkRZ5l81tUsiqxJJIDX7knXvafRr2oyJXeTAkLMSxCzyKCT7AGhpR/RX2uwc1MhMDL+6Zg4V5pGUN6EAn20HPxq0T48rdtn//Z" }
                ],
                currentUser: null,
                stats: {
                    activeAthletes: 2847,
                    activeClubs: 156,
                    certifications: 342,
                    instructors: 89,
                    events: 23
                },
                welcome: {
                    title: "Welcome to PTF Dashboard",
                    description: "Manage athletes, track progress, schedule tests, and oversee competitions with our modern management system."
                },
                presidentWelcome: {
                    message: "It is with immense pleasure that I welcome you to the official dashboard of the Pakistan Taekwondo Federation. This platform is a testament to our commitment to transparency, efficiency, and the advancement of Taekwondo in our nation. Let's work together to elevate our athletes to new heights."
                },
                regionalStats: {
                    regions: {
                        "Punjab": { athletes: 1284, clubs: 45, icon: 'fa-landmark' },
                        "Sindh": { athletes: 996, clubs: 38, icon: 'fa-water' },
                        "Balochistan": { athletes: 140, clubs: 12, icon: 'fa-mountain' },
                        "KPK": { athletes: 427, clubs: 25, icon: 'fa-tree' },
                        "Gilgit Baltistan": { athletes: 85, clubs: 8, icon: 'fa-snowflake' },
                        "Azad Kashmir": { athletes: 115, clubs: 10, icon: 'fa-dove' },
                        "Islamabad": { athletes: 350, clubs: 22, icon: 'fa-building-columns' }
                    },
                    departments: {
                        "Army": { athletes: 250, clubs: 5, icon: 'fa-user-shield' },
                        "Navy": { athletes: 150, clubs: 3, icon: 'fa-anchor' },
                        "Air Force": { athletes: 180, clubs: 4, icon: 'fa-plane' },
                        "HEC": { athletes: 200, clubs: 15, icon: 'fa-university' },
                        "Railway": { athletes: 120, clubs: 6, icon: 'fa-train' },
                        "SPD": { athletes: 90, clubs: 2, icon: 'fa-shield-alt' }
                    }
                },
                activities: [
                    { id: 1, type: "Dan Test", description: "Ali Hassan passed 1st Dan test", date: "2025-09-25", score: "8.7/10" },
                    { id: 2, type: "Registration", description: "Karachi Warriors registered 5 new athletes", date: "2025-09-24", club: "KW-2025" },
                    { id: 3, type: "Competition", description: "National Championship registration opened", date: "2025-09-23", deadline: "2025-11-01" },
                    { id: 4, type: "License", description: "15 licenses updated in Kukkiwon database", date: "2025-09-22", status: "Sync completed" }
                ],
                events: [
                    { id: 1, name: "National Championship", date: "2025-11-15", endDate: "2025-11-17", location: "Punjab Stadium, Lahore", participants: 234, status: "Registration Open", registeredAthletes: ["PTF-001", "PTF-003"] },
                    { id: 2, name: "Master Workshop", date: "2025-11-20", location: "Karachi Sports Complex", participants: 45, maxParticipants: 60, status: "Limited Seats", registeredAthletes: [] },
                    { id: 3, name: "Training Camp", date: "2025-12-01", endDate: "2025-12-15", location: "National Training Center", participants: 12, status: "Selection Based", registeredAthletes: [] }
                ],
                athletes: [
                    { id: "PTF-001", name: "Ali Hassan", belt: "Black", club: "Karachi Warriors", region: "Sindh", age: 22, wins: 45, losses: 5, coachNotes: "Exceptional speed and power. A natural leader." },
                    { id: "PTF-002", name: "Fatima Khan", belt: "Red", club: "Lahore Lions", region: "Punjab", age: 19, wins: 32, losses: 4, coachNotes: "Incredible flexibility and technique. Needs to be more aggressive in sparring." },
                    { id: "PTF-003", name: "Zain Ahmed", belt: "Black", club: "Peshawar Panthers", region: "KPK", age: 25, wins: 50, losses: 8, coachNotes: "Veteran competitor, very strategic. Peak physical condition." },
                    { id: "PTF-004", name: "Aisha Begum", belt: "Blue", club: "Quetta Gladiators", region: "Balochistan", age: 17, wins: 25, losses: 3, coachNotes: "Prodigy. Very fast learner with a strong competitive drive. Huge potential." },
                    { id: "PTF-005", name: "Bilal Malik", belt: "Green", club: "Lahore Lions", region: "Punjab", age: 20, wins: 28, losses: 10, coachNotes: "Good stamina, but needs work on precision." },
                    { id: "PTF-006", name: "Sana Tariq", belt: "Yellow", club: "Karachi Warriors", region: "Sindh", age: 16, wins: 15, losses: 2, coachNotes: "Raw talent. Fearless and strong, needs technical refinement." },
                    { id: "PTF-007", name: "Usman Dar", belt: "Red", club: "Islamabad Eagles", region: "Azad Kashmir", age: 21, wins: 35, losses: 9, coachNotes: "Excellent defensive skills. Can be too cautious on the offense." }
                ],
                danTests: [
                    { id: 1, athleteId: "PTF-001", athleteName: "Ali Hassan", danLevel: 2, testDate: "2025-08-15", examiner: "Grandmaster Kim", result: "Pass", kukkiwonCertNo: "K-2-12345" },
                    { id: 2, athleteId: "PTF-003", athleteName: "Zain Ahmed", danLevel: 3, testDate: "2025-08-15", examiner: "Grandmaster Kim", result: "Pass", kukkiwonCertNo: "K-3-67890" }
                ],
                licenses: [
                    { id: 1, holderName: "Coach Ahmed", licenseType: "National Coach", licenseId: "NC-055", issueDate: "2025-01-10", expiryDate: "2028-01-10", status: "Active" },
                    { id: 2, holderName: "Referee Fatima", licenseType: "International Referee", licenseId: "IR-012", issueDate: "2024-06-20", expiryDate: "2027-06-20", status: "Active" }
                ]
            };
            this.saveData(defaultData);
        }
    }
    
    getData() {
        return JSON.parse(localStorage.getItem('ptfData') || '{}');
    }
    
    saveData(data) {
        localStorage.setItem('ptfData', JSON.stringify(data));
    }

    login(email, password) {
        const data = this.getData();
        const user = data.users.find(u => u.email === email && u.password === password);
        if (user) {
            data.currentUser = user;
            this.saveData(data);
            return user;
        }
        return null;
    }

    logout() {
        const data = this.getData();
        data.currentUser = null;
        this.saveData(data);
    }
    
    getCurrentUser() {
        const data = this.getData();
        return data.currentUser;
    }

    getUsers() {
        return this.getData().users || [];
    }

    addUser(user) {
        const data = this.getData();
        user.id = Date.now();
        user.avatar = `https://i.pravatar.cc/150?u=${user.email}`;
        data.users.push(user);
        this.saveData(data);
        return user;
    }

    updateUser(updatedUser) {
        const data = this.getData();
        const userIndex = data.users.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
            // Keep original password if new one is blank
            if (!updatedUser.password) {
                updatedUser.password = data.users[userIndex].password;
            }
            data.users[userIndex] = { ...data.users[userIndex], ...updatedUser };
            this.saveData(data);
            return true;
        }
        return false;
    }

    deleteUser(userId) {
        const data = this.getData();
        const initialLength = data.users.length;
        data.users = data.users.filter(u => u.id !== userId);
        if (data.users.length < initialLength) {
            this.saveData(data);
            return true;
        }
        return false;
    }
    
    updateField(section, field, value) {
        const data = this.getData();
        if (data[section]) {
            // Handle numeric stats
            if (section === 'stats' && !isNaN(Number(value))) {
                data[section][field] = Number(value);
            } else {
                 data[section][field] = value;
            }
            this.saveData(data);
            return true;
        }
        return false;
    }

    updateRegionDept(type, name, data, originalName = null) {
        const dbData = this.getData();
        if (!dbData.regionalStats || !dbData.regionalStats[type]) {
            return false;
        }
    
        // If it's an update and the name has changed, delete the old entry
        if (originalName && originalName !== name) {
            delete dbData.regionalStats[type][originalName];
        }
        
        dbData.regionalStats[type][name] = data;
        this.saveData(dbData);
        return true;
    }
    
    deleteRegionDept(type, name) {
        const dbData = this.getData();
        if (!dbData.regionalStats || !dbData.regionalStats[type] || !dbData.regionalStats[type][name]) {
            return false;
        }
        
        delete dbData.regionalStats[type][name];
        this.saveData(dbData);
        return true;
    }
    
    addActivity(activity) {
        const data = this.getData();
        if (!data.activities) data.activities = [];
        activity.id = Date.now(); // Simple ID generation
        data.activities.unshift(activity); // Add to beginning
        this.saveData(data);
        return activity.id;
    }
    
    removeActivity(id) {
        const data = this.getData();
        if (data.activities) {
            data.activities = data.activities.filter(a => a.id !== id);
            this.saveData(data);
            return true;
        }
        return false;
    }

    addAthlete(athlete) {
        const data = this.getData();
        if (!data.athletes) data.athletes = [];
        const nextId = 'PTF-' + String(data.athletes.length + 1).padStart(3, '0');
        athlete.id = nextId;
        data.athletes.push(athlete);
        this.saveData(data);
        return athlete.id;
    }
    
    addEvent(event) {
        const data = this.getData();
        if (!data.events) data.events = [];
        event.id = Date.now(); // Simple ID generation
        data.events.unshift(event); // Add to beginning
        this.saveData(data);
        return event.id;
    }
    
    removeEvent(id) {
        const data = this.getData();
        if (data.events) {
            data.events = data.events.filter(e => e.id !== id);
            this.saveData(data);
            return true;
        }
        return false;
    }
    
    registerAthletesForEvent(eventId: number, selectedAthleteIds: string[]) {
        const data = this.getData();
        const eventIndex = data.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            data.events[eventIndex].registeredAthletes = selectedAthleteIds;
            data.events[eventIndex].participants = selectedAthleteIds.length;
            this.saveData(data);
            return true;
        }
        return false;
    }
    
    addDanTest(test) {
        const data = this.getData();
        if (!data.danTests) data.danTests = [];
        test.id = Date.now();
        data.danTests.unshift(test);
        this.saveData(data);
        return test.id;
    }

    removeDanTest(id) {
        const data = this.getData();
        if (data.danTests) {
            data.danTests = data.danTests.filter(t => t.id !== id);
            this.saveData(data);
            return true;
        }
        return false;
    }

    addLicense(license) {
        const data = this.getData();
        if (!data.licenses) data.licenses = [];
        license.id = Date.now();
        data.licenses.unshift(license);
        this.saveData(data);
        return license.id;
    }

    removeLicense(id) {
        const data = this.getData();
        if (data.licenses) {
            data.licenses = data.licenses.filter(l => l.id !== id);
            this.saveData(data);
            return true;
        }
        return false;
    }

    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ptf-data-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result as string);
                    this.saveData(data);
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
}

// UI Controller
class PTFUIController {
    db: PTFDatabase;
    currentUser: any;
    editMode: boolean;
    currentEditElement: { element: HTMLElement, type: string, field: string } | null;
    ai: GoogleGenAI | null;
    theme: string;
    regionalChartInstance: any | null;


    constructor() {
        this.db = new PTFDatabase();
        this.currentUser = null;
        this.editMode = false;
        this.currentEditElement = null;
        this.ai = null;
        this.theme = localStorage.getItem('ptfTheme') || 'light';
        this.regionalChartInstance = null;
        this.init();
    }
    
    init() {
        this.currentUser = this.db.getCurrentUser();
        this.setupApiKey();
        this.applyTheme();
        this.setupEventListeners();
        
        if (this.currentUser) {
            this.renderAppForUser();
        } else {
            this.showLoginModal();
        }
    }

    renderAppForUser() {
        document.getElementById('appContainer').style.display = 'block';
        document.getElementById('loginModal').style.display = 'none';

        const isAdmin = this.currentUser.role === 'Admin';

        // Update User Profile in Header
        document.getElementById('currentUserName').textContent = this.currentUser.name;
        (document.getElementById('currentUserAvatar') as HTMLImageElement).src = this.currentUser.avatar;

        // Toggle Admin-only UI elements
        document.getElementById('editModeToggle').style.display = isAdmin ? 'block' : 'none';
        document.getElementById('exportData').style.display = isAdmin ? 'block' : 'none';
        document.getElementById('importData').style.display = isAdmin ? 'block' : 'none';
        document.getElementById('regionsTabBtn').style.display = isAdmin ? 'block' : 'none';
        document.getElementById('usersTabBtn').style.display = isAdmin ? 'block' : 'none';
        document.getElementById('quickActions').style.display = isAdmin ? 'block' : 'none';
        
        document.querySelectorAll('#addActivityBtn, #addEventBtn, #addEventBtn2, #danTestForm button, #licenseForm button').forEach(btn => {
            (btn as HTMLElement).style.display = isAdmin ? 'inline-block' : 'none';
        });

        this.loadData();
        this.renderActivities();
        this.renderEvents();
        this.renderDanTests();
        this.renderLicenses();
        this.populateAthleteFilters();
        this.renderAthletes();
        this.renderAnalyticsChart();

        // Switch to dashboard by default
        this.switchTab('dashboard');
    }

    showLoginModal() {
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('loginModal').style.display = 'flex';
    }

    handleLogin(e: Event) {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const user = this.db.login(email, password);
        const errorEl = document.getElementById('loginError');

        if (user) {
            this.currentUser = user;
            errorEl.textContent = '';
            this.renderAppForUser();
        } else {
            errorEl.textContent = 'Invalid email or password.';
        }
    }

    handleLogout() {
        this.db.logout();
        this.currentUser = null;
        this.editMode = false; // Turn off edit mode on logout
        document.body.classList.remove('edit-mode');
        this.showLoginModal();
    }

    setupApiKey() {
        // FIX: Per coding guidelines, the API key must be obtained from the environment variable.
        try {
            this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        } catch (error) {
            console.error("Error initializing GoogleGenAI:", error);
            this.showNotification('Failed to initialize AI. Please ensure API_KEY is set correctly.', 'error');
            this.ai = null;
        }
    }
    
    loadData() {
        const data = this.db.getData();
        
        // Load stats
        if (data.stats) {
            document.getElementById('activeAthletesCount').textContent = data.stats.activeAthletes.toLocaleString();
        }
        
        // Load president's welcome message
        if (data.presidentWelcome) {
            const welcomeMessage = document.getElementById('presidentWelcomeMessage');
            if (welcomeMessage) {
                welcomeMessage.textContent = data.presidentWelcome.message;
            }
        }
    }
    
    setupEventListeners() {
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        document.getElementById('editModeToggle').addEventListener('click', () => this.toggleEditMode());
        document.getElementById('exportData').addEventListener('click', () => {
            this.db.exportData();
            this.showNotification('Data exported successfully', 'success');
        });
        document.getElementById('importData').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files[0];
                if (file) {
                    this.db.importData(file)
                        .then(() => {
                            this.loadData();
                            this.renderActivities();
                            this.renderEvents();
                            this.populateAthleteFilters();
                            this.renderAthletes();
                            this.renderAnalyticsChart();
                            this.showNotification('Data imported successfully', 'success');
                        })
                        .catch(error => {
                            this.showNotification('Error importing data', 'error');
                            console.error(error);
                        });
                }
            };
            input.click();
        });
        document.getElementById('addActivityBtn').addEventListener('click', () => this.showModal('addActivityModal'));
        document.getElementById('addEventBtn').addEventListener('click', () => this.showModal('addEventModal'));
        document.getElementById('addEventBtn2').addEventListener('click', () => this.showModal('addEventModal'));

        // Athlete modals and picture preview
        document.getElementById('addAthleteBtn').addEventListener('click', (e) => {
             e.preventDefault(); 
             (document.getElementById('athletePicturePreview') as HTMLImageElement).src = 'https://via.placeholder.com/150';
             (document.getElementById('athleteForm') as HTMLFormElement).reset();
             this.showModal('addAthleteModal'); 
        });

        // Enhanced athlete picture input handler with validation and preview
        const athletePictureInput = document.getElementById('athletePicture') as HTMLInputElement;
        if (athletePictureInput) {
            athletePictureInput.addEventListener('change', (e) => {
                const input = e.target as HTMLInputElement;
                const file = input.files?.[0];
                const preview = document.getElementById('athletePicturePreview') as HTMLImageElement;
                const defaultPreviewSrc = 'https://via.placeholder.com/150';

                if (!file) {
                    preview.src = defaultPreviewSrc;
                    return;
                }

                // --- Validation ---
                const MAX_SIZE_MB = 2;
                const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
                const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

                if (!ALLOWED_TYPES.includes(file.type)) {
                    this.showNotification(`Invalid file type. Please select an image.`, 'error');
                    input.value = ''; // Reset the file input
                    preview.src = defaultPreviewSrc;
                    return;
                }

                if (file.size > MAX_SIZE_BYTES) {
                    this.showNotification(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`, 'error');
                    input.value = ''; // Reset the file input
                    preview.src = defaultPreviewSrc;
                    return;
                }

                // If valid, show preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    preview.src = event.target?.result as string;
                };
                reader.readAsDataURL(file);
            });
        }
        document.getElementById('findGemBtn').addEventListener('click', () => this.findTalentGem());


        document.getElementById('activityForm').addEventListener('submit', (e) => { e.preventDefault(); this.addActivityFromForm(); });
        document.getElementById('eventForm').addEventListener('submit', (e) => { e.preventDefault(); this.addEventFromForm(); });
        document.getElementById('athleteForm').addEventListener('submit', (e) => { e.preventDefault(); this.addAthleteFromForm(); });
        document.getElementById('editForm').addEventListener('submit', (e) => { e.preventDefault(); this.saveEdit(); });
        document.getElementById('poomsaeForm').addEventListener('submit', (e) => { e.preventDefault(); this.generatePoomsae(); });
        document.getElementById('kyorugiForm').addEventListener('submit', (e) => { e.preventDefault(); this.generateKyorugiPlan(); });
        document.getElementById('regionDeptForm').addEventListener('submit', (e) => { e.preventDefault(); this.saveRegionDept(); });
        document.getElementById('userForm').addEventListener('submit', (e) => { e.preventDefault(); this.saveUser(); });
        document.getElementById('registerAthletesForm').addEventListener('submit', (e) => { e.preventDefault(); this.saveEventRegistration(); });
        document.getElementById('danTestForm').addEventListener('submit', (e) => { e.preventDefault(); this.addDanTestFromForm(); });
        document.getElementById('licenseForm').addEventListener('submit', (e) => { e.preventDefault(); this.addLicenseFromForm(); });


        document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', () => this.hideModals()));
        document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', (e) => { if (e.target === modal || e.target === document.getElementById('talentGemModalContent')) this.hideModals(); }));

        document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab(btn.getAttribute('data-tab'));
        }));
        document.getElementById('generateInsightsBtn').addEventListener('click', () => this.generateInsights());

        // Athlete filters
        const athleteSearchInput = document.getElementById('athleteSearchInput') as HTMLInputElement;
        const athleteBeltFilter = document.getElementById('athleteBeltFilter') as HTMLSelectElement;
        const athleteRegionFilter = document.getElementById('athleteRegionFilter') as HTMLSelectElement;

        const handleAthleteFilterChange = () => this.renderAthletes();

        if (athleteSearchInput) athleteSearchInput.addEventListener('input', handleAthleteFilterChange);
        if (athleteBeltFilter) athleteBeltFilter.addEventListener('change', handleAthleteFilterChange);
        if (athleteRegionFilter) athleteRegionFilter.addEventListener('change', handleAthleteFilterChange);
        
        // Dark Mode Toggle
        document.getElementById('darkModeToggle').addEventListener('change', () => this.toggleDarkMode());

        document.getElementById('athleteListContainer').addEventListener('click', (e: MouseEvent) => {
            const card = (e.target as HTMLElement).closest('.athlete-card');
            if (card) {
                const athleteId = card.getAttribute('data-id');
                if (athleteId) {
                    this.showAthleteDetailModal(athleteId);
                }
            }
        });
    }
    
    toggleEditMode() {
        if (this.currentUser.role !== 'Admin') return;
        this.editMode = !this.editMode;
        document.body.classList.toggle('edit-mode', this.editMode);
        document.getElementById('editStatus').textContent = this.editMode ? 'ON' : 'OFF';
        
        document.querySelectorAll('.editable').forEach(el => {
            if (this.editMode) {
                el.addEventListener('click', this.handleEditClick);
            } else {
                el.removeEventListener('click', this.handleEditClick);
            }
        });
        this.renderActivities(); // Re-render to show/hide delete buttons
        this.renderEvents();
        this.renderDanTests();
        this.renderLicenses();
        this.showNotification(`Edit mode ${this.editMode ? 'enabled' : 'disabled'}`, 'info');
    }
    
    handleEditClick = (e: MouseEvent) => {
        if (!this.editMode) return;
        
        const element = e.currentTarget as HTMLElement;
        const type = element.getAttribute('data-type');
        const field = element.getAttribute('data-field');
        
        // FIX: Add a guard to ensure `type` and `field` are not null to satisfy type requirements downstream.
        if (!type || !field) return;

        this.currentEditElement = { element, type, field };

        let currentValue = '';
        // FIX: Safely access textContent and handle potential null values.
        if (type === 'stats') {
            currentValue = (element.querySelector('.text-2xl, .text-xl')?.textContent || '').replace(/,/g, '');
        } else if (type === 'presidentWelcome') {
             currentValue = element.querySelector('p#presidentWelcomeMessage')?.textContent || '';
        } else {
            currentValue = element.textContent || '';
        }

        this.showEditModal(field, currentValue.trim());
    }
    
    // FIX: Add explicit types to function parameters to resolve 'unknown is not assignable to string' error.
    showEditModal(field: string, currentValue: string) {
        (document.getElementById('editFieldName') as HTMLInputElement).value = field;
        (document.getElementById('editFieldValue') as HTMLTextAreaElement).value = currentValue;
        this.showModal('editModal');
    }
    
    saveEdit() {
        if (!this.currentEditElement) return;
        
        const { type, field } = this.currentEditElement;
        const newValue = (document.getElementById('editFieldValue') as HTMLTextAreaElement).value;
        
        this.db.updateField(type, field, newValue);
        this.loadData();
        
        this.hideModals();
        this.showNotification('Content updated successfully', 'success');
    }
    
    showModal(modalId) { (document.getElementById(modalId) as HTMLElement).style.display = 'flex'; }
    hideModals() { document.querySelectorAll('.modal').forEach(modal => (modal as HTMLElement).style.display = 'none'); }
    
    addActivityFromForm() {
        const form = document.getElementById('activityForm') as HTMLFormElement;
        const formData = new FormData(form);
        const description = (formData.get('description') as string)?.trim();
        const date = formData.get('date') as string;

        if (!description || !date) {
            this.showNotification('Description and date cannot be empty.', 'error');
            return;
        }

        const activity = {
            type: formData.get('type') as string,
            description: description,
            date: date
        };
        
        this.db.addActivity(activity);
        this.renderActivities();
        this.hideModals();
        form.reset();
        this.showNotification('Activity added successfully', 'success');
    }
    
    addEventFromForm() {
        const form = document.getElementById('eventForm') as HTMLFormElement;
        const formData = new FormData(form);
        const name = (formData.get('name') as string)?.trim();
        const location = (formData.get('location') as string)?.trim();
        const date = formData.get('date') as string;

        if (!name || !location || !date) {
            this.showNotification('All event fields are required.', 'error');
            return;
        }
        
        const event = {
            name: name,
            date: date,
            location: location,
            participants: 0,
            status: 'Upcoming',
            registeredAthletes: []
        };
        
        this.db.addEvent(event);
        this.renderEvents();
        this.hideModals();
        form.reset();
        this.showNotification('Event added successfully', 'success');
    }

    addAthleteFromForm() {
        const form = document.getElementById('athleteForm') as HTMLFormElement;
        const formData = new FormData(form);
    
        const name = (formData.get('name') as string)?.trim();
        const ageStr = formData.get('age') as string;
        const region = (formData.get('region') as string)?.trim();
        const club = (formData.get('club') as string)?.trim();
    
        if (!name || !ageStr || !region || !club) {
            this.showNotification('Name, age, region, and club are required.', 'error');
            return;
        }
    
        const age = parseInt(ageStr, 10);
        if (isNaN(age) || age < 5 || age > 60) {
            this.showNotification('Please enter a valid age between 5 and 60.', 'error');
            return;
        }
    
        const fileInput = document.getElementById('athletePicture') as HTMLInputElement;
        const file = fileInput.files[0];
    
        const createAthlete = (profilePictureBase64: string | null) => {
            const newAthlete = {
                name: name,
                age: age,
                belt: formData.get('belt') as string,
                region: region,
                club: club,
                coachNotes: (formData.get('coachNotes') as string)?.trim(),
                wins: 0,
                losses: 0,
                profilePicture: profilePictureBase64
            };
    
            this.db.addAthlete(newAthlete);
            this.populateAthleteFilters();
            this.renderAthletes();
            this.hideModals();
            form.reset();
            (document.getElementById('athletePicturePreview') as HTMLImageElement).src = 'https://via.placeholder.com/150';
            this.showNotification('Athlete added successfully!', 'success');
        };
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                createAthlete(e.target.result as string);
            };
            reader.onerror = () => {
                this.showNotification('Failed to read image.', 'error');
            };
            reader.readAsDataURL(file);
        } else {
            createAthlete(null);
        }
    }
    
    addDanTestFromForm() {
        const form = document.getElementById('danTestForm') as HTMLFormElement;
        const formData = new FormData(form);
        const athleteId = formData.get('athleteId') as string;
        const danLevel = formData.get('danLevel') as string;
        const testDate = formData.get('testDate') as string;

        if (!athleteId || !danLevel || !testDate) {
            this.showNotification('Athlete, Dan Level, and Test Date are required.', 'error');
            return;
        }

        const athlete = this.db.getData().athletes.find(a => a.id === athleteId);

        const testRecord = {
            athleteId: athleteId,
            athleteName: athlete ? athlete.name : 'Unknown',
            danLevel: parseInt(danLevel),
            testDate: testDate,
            examiner: formData.get('examiner') as string,
            result: formData.get('result') as string,
            kukkiwonCertNo: formData.get('kukkiwonCertNo') as string,
        };

        this.db.addDanTest(testRecord);
        this.renderDanTests();
        form.reset();
        this.showNotification('Dan Test record added successfully!', 'success');
    }

    addLicenseFromForm() {
        const form = document.getElementById('licenseForm') as HTMLFormElement;
        const formData = new FormData(form);

        const holderName = (formData.get('holderName') as string)?.trim();
        const licenseId = (formData.get('licenseId') as string)?.trim();
        const issueDate = formData.get('issueDate') as string;
        const expiryDate = formData.get('expiryDate') as string;

        if (!holderName || !licenseId || !issueDate || !expiryDate) {
            this.showNotification('All license fields are required.', 'error');
            return;
        }

        const licenseRecord = {
            holderName: holderName,
            licenseType: formData.get('licenseType') as string,
            licenseId: licenseId,
            issueDate: issueDate,
            expiryDate: expiryDate,
            status: new Date(expiryDate) > new Date() ? "Active" : "Expired",
        };

        this.db.addLicense(licenseRecord);
        this.renderLicenses();
        form.reset();
        this.showNotification('License issued successfully!', 'success');
    }
    
    renderActivities() {
        const container = document.getElementById('activityList');
        const activities = this.db.getData().activities || [];
        const isDeletable = this.editMode && this.currentUser.role === 'Admin';

        container.innerHTML = activities.map((activity, index) => `
            <div class="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors activity-item animate-in" style="animation-delay: ${index * 0.05}s" data-id="${activity.id}">
                <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-${this.getActivityIcon(activity.type)} text-emerald-600"></i>
                </div>
                <div class="flex-1">
                    <p class="font-medium">${activity.description}</p>
                    <p class="text-sm text-gray-500">${this.formatActivityDetails(activity)} • ${activity.date}</p>
                </div>
                ${isDeletable ? `<button class="delete-activity text-red-500 hover:text-red-700" data-id="${activity.id}"><i class="fas fa-trash"></i></button>` : ''}
            </div>
        `).join('');
        
        if (isDeletable) {
            document.querySelectorAll('.delete-activity').forEach(btn => btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-id'));
                this.deleteActivity(id);
            }));
        }
    }
    
    renderEvents() {
        const container = document.getElementById('eventsList');
        const events = this.db.getData().events || [];
        const isDeletable = this.editMode && this.currentUser.role === 'Admin';
        const isAdmin = this.currentUser.role === 'Admin';

        container.innerHTML = events.map((event, index) => `
            <div class="p-4 bg-gradient-to-r from-${this.getEventColor(event)}-50 to-${this.getEventColor(event)}-100 rounded-xl border-l-4 border-${this.getEventColor(event)}-500 event-item animate-in" style="animation-delay: ${index * 0.05}s" data-id="${event.id}">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-${this.getEventColor(event)}-800">${event.name}</h4>
                    <span class="bg-${this.getEventColor(event)}-500 text-white text-xs px-2 py-1 rounded-full">${event.date}</span>
                </div>
                <p class="text-sm text-${this.getEventColor(event)}-700">${event.location}</p>
                <div class="mt-3 flex items-center text-xs text-${this.getEventColor(event)}-600">
                    <i class="fas fa-users mr-1"></i>
                    <span>${event.participants} registered</span>
                    <div class="ml-auto flex items-center space-x-3">
                        ${isAdmin ? `<button class="register-athletes-btn text-emerald-600 hover:text-emerald-800 font-semibold text-xs flex items-center" data-id="${event.id}"><i class="fas fa-user-plus mr-1"></i>Register</button>` : ''}
                        ${isDeletable ? `<button class="delete-event text-red-500 hover:text-red-700" data-id="${event.id}"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        if (isAdmin) {
            document.querySelectorAll('.delete-event').forEach(btn => btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-id'));
                this.deleteEvent(id);
            }));
            document.querySelectorAll('.register-athletes-btn').forEach(btn => btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-id'));
                this.showRegistrationModal(id);
            }));
        }
    }

    renderAnalyticsChart() {
        const regionalData = this.db.getData().regionalStats;
        if (!regionalData) return;

        const ctx = (document.getElementById('regionalAnalyticsChart') as HTMLCanvasElement)?.getContext('2d');
        if (!ctx) return;

        const allEntries = [
            ...Object.entries(regionalData.regions).map(([name, data]) => ({ name, ...data, type: 'Region' })),
            ...Object.entries(regionalData.departments).map(([name, data]) => ({ name, ...data, type: 'Department' }))
        ];

        allEntries.sort((a, b) => b.athletes - a.athletes);

        const labels = allEntries.map(entry => entry.name);
        const athleteData = allEntries.map(entry => entry.athletes);
        
        const isDarkMode = document.body.classList.contains('dark-mode');
        const gridColor = isDarkMode ? 'rgba(209, 213, 219, 0.2)' : '#e5e7eb';
        const textColor = isDarkMode ? '#d1d5db' : '#4b5563';

        const backgroundColors = allEntries.map(entry => entry.type === 'Region' 
            ? 'rgba(16, 185, 129, 0.8)' // Emerald
            : 'rgba(59, 130, 246, 0.8)'  // Blue
        );
        const borderColors = allEntries.map(entry => entry.type === 'Region' 
            ? 'rgb(16, 185, 129)'
            : 'rgb(59, 130, 246)'
        );

        if (this.regionalChartInstance) {
            this.regionalChartInstance.destroy();
        }

        this.regionalChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Athletes',
                    data: athleteData,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Athlete Distribution by Region & Department',
                        color: textColor,
                        font: { size: 16 }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: textColor, precision: 0 }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }

    renderDanTests() {
        const data = this.db.getData();
        const athletes = data.athletes || [];
        const danTests = data.danTests || [];
        const container = document.getElementById('danTestListContainer');
        const athleteSelect = document.getElementById('danTestAthlete') as HTMLSelectElement;
        const isDeletable = this.editMode && this.currentUser.role === 'Admin';
    
        // Populate athlete dropdown
        athleteSelect.innerHTML = '<option value="">Select an athlete</option>';
        athletes.forEach(athlete => {
            athleteSelect.innerHTML += `<option value="${athlete.id}">${athlete.name} (${athlete.id})</option>`;
        });
    
        // Render table
        if (danTests.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-500 py-8">No Dan Test records found.</p>`;
            return;
        }
    
        container.innerHTML = `
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b">
                        <th class="p-3">Athlete</th>
                        <th class="p-3">Dan Level</th>
                        <th class="p-3">Date</th>
                        <th class="p-3">Result</th>
                        <th class="p-3">Cert #</th>
                        ${isDeletable ? '<th class="p-3 text-right"></th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${danTests.map((test, index) => `
                        <tr class="border-b hover:bg-gray-50 animate-in" style="animation-delay: ${index * 0.05}s">
                            <td class="p-3 font-medium">${test.athleteName}</td>
                            <td class="p-3 text-center">${test.danLevel}</td>
                            <td class="p-3 text-gray-600">${test.testDate}</td>
                            <td class="p-3">
                                <span class="px-2 py-1 text-xs rounded-full ${test.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${test.result}</span>
                            </td>
                            <td class="p-3 text-gray-500">${test.kukkiwonCertNo || 'N/A'}</td>
                            ${isDeletable ? `<td class="p-3 text-right"><button class="delete-dan-test text-red-400 hover:text-red-600" data-id="${test.id}"><i class="fas fa-trash"></i></button></td>` : ''}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    
        if (isDeletable) {
            document.querySelectorAll('.delete-dan-test').forEach(btn => btn.addEventListener('click', (e) => {
                const id = parseInt((e.currentTarget as HTMLElement).getAttribute('data-id'));
                this.deleteDanTest(id);
            }));
        }
    }

    renderLicenses() {
        const licenses = this.db.getData().licenses || [];
        const container = document.getElementById('licenseListContainer');
        const isDeletable = this.editMode && this.currentUser.role === 'Admin';
    
        if (licenses.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-500 py-8">No license records found.</p>`;
            return;
        }
    
        container.innerHTML = `
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b">
                        <th class="p-3">Holder Name</th>
                        <th class="p-3">Type</th>
                        <th class="p-3">Expires</th>
                        <th class="p-3">Status</th>
                        ${isDeletable ? '<th class="p-3 text-right"></th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${licenses.map((license, index) => {
                        const isExpired = new Date(license.expiryDate) < new Date();
                        return `
                        <tr class="border-b hover:bg-gray-50 animate-in" style="animation-delay: ${index * 0.05}s">
                            <td class="p-3 font-medium">${license.holderName} <span class="text-gray-400 text-sm">(${license.licenseId})</span></td>
                            <td class="p-3 text-gray-600">${license.licenseType}</td>
                            <td class="p-3 text-gray-600">${license.expiryDate}</td>
                            <td class="p-3">
                                <span class="px-2 py-1 text-xs rounded-full ${isExpired ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}">
                                    ${isExpired ? 'Expired' : 'Active'}
                                </span>
                            </td>
                            ${isDeletable ? `<td class="p-3 text-right"><button class="delete-license text-red-400 hover:text-red-600" data-id="${license.id}"><i class="fas fa-trash"></i></button></td>` : ''}
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        `;
    
        if (isDeletable) {
            document.querySelectorAll('.delete-license').forEach(btn => btn.addEventListener('click', (e) => {
                const id = parseInt((e.currentTarget as HTMLElement).getAttribute('data-id'));
                this.deleteLicense(id);
            }));
        }
    }
    
    deleteActivity(id) {
        if (confirm('Are you sure you want to delete this activity?')) {
            this.db.removeActivity(id);
            this.renderActivities();
            this.showNotification('Activity deleted', 'success');
        }
    }
    
    deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.db.removeEvent(id);
            this.renderEvents();
            this.showNotification('Event deleted', 'success');
        }
    }
    
    deleteDanTest(id: number) {
        if (confirm('Are you sure you want to delete this Dan Test record?')) {
            this.db.removeDanTest(id);
            this.renderDanTests();
            this.showNotification('Dan Test record deleted.', 'success');
        }
    }

    deleteLicense(id: number) {
        if (confirm('Are you sure you want to delete this license record?')) {
            this.db.removeLicense(id);
            this.renderLicenses();
            this.showNotification('License record deleted.', 'success');
        }
    }

    populateAthleteFilters() {
        const athletes = this.db.getData().athletes || [];
        const regionFilter = document.getElementById('athleteRegionFilter') as HTMLSelectElement;
        if (!regionFilter) return;

        const regions = [...new Set(athletes.map(a => a.region))];
        
        regionFilter.innerHTML = '<option value="All">All Regions</option>';
        
        regions.sort().forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });
    }

    renderAthletes() {
        const container = document.getElementById('athleteListContainer');
        if (!container) return;
    
        const searchTerm = (document.getElementById('athleteSearchInput') as HTMLInputElement).value.toLowerCase().trim();
        const selectedBelt = (document.getElementById('athleteBeltFilter') as HTMLSelectElement).value;
        const selectedRegion = (document.getElementById('athleteRegionFilter') as HTMLSelectElement).value;
    
        const allAthletes = this.db.getData().athletes || [];
        const filteredAthletes = allAthletes.filter(athlete => {
            const nameMatch = athlete.name.toLowerCase().includes(searchTerm) || athlete.id.toLowerCase().includes(searchTerm);
            const beltMatch = selectedBelt === 'All' || athlete.belt === selectedBelt;
            const regionMatch = selectedRegion === 'All' || athlete.region === selectedRegion;
    
            return nameMatch && beltMatch && regionMatch;
        });
    
        if (filteredAthletes.length === 0) {
            container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">
                <i class="fas fa-user-slash fa-3x mb-4 text-gray-300"></i>
                <h3 class="text-xl font-semibold">No Athletes Found</h3>
                <p>No athletes match your current filter criteria.</p>
            </div>`;
            return;
        }
    
        container.innerHTML = filteredAthletes.map((athlete, index) => {
            const beltColors = {
                'Black': 'belt-black text-white', 'Red': 'belt-red text-white', 'Blue': 'belt-blue text-white',
                'Green': 'belt-green text-white', 'Yellow': 'belt-yellow text-gray-800', 'White': 'belt-white text-gray-800'
            };
            const beltClass = beltColors[athlete.belt] || 'bg-gray-200 text-gray-800';
            const profileImage = athlete.profilePicture
                ? `<img src="${athlete.profilePicture}" alt="${athlete.name}" class="w-16 h-16 rounded-full object-cover shadow-sm">`
                : `<div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"><i class="fas fa-user text-3xl text-gray-400"></i></div>`;
    
            return `
            <div class="bg-white rounded-xl shadow-sm card-hover p-5 border border-gray-200/80 animate-in athlete-card cursor-pointer" data-id="${athlete.id}" style="animation-delay: ${index * 0.05}s">
                <div class="flex items-center space-x-4 mb-4">
                    ${profileImage}
                    <div class="flex-grow">
                        <h4 class="font-bold text-lg text-gray-800">${athlete.name}</h4>
                        <p class="text-sm text-gray-500">${athlete.id}</p>
                    </div>
                    <div class="text-xs font-bold px-3 py-1 rounded-full self-start ${beltClass}">${athlete.belt} Belt</div>
                </div>
                <div class="pt-4 border-t border-gray-200 space-y-2 text-sm">
                    <div class="flex items-center text-gray-600"><i class="fas fa-shield-alt w-5 text-center text-gray-400 mr-2"></i><span>${athlete.club}</span></div>
                    <div class="flex items-center text-gray-600"><i class="fas fa-map-marker-alt w-5 text-center text-gray-400 mr-2"></i><span>${athlete.region}</span></div>
                    <div class="flex items-center text-gray-600"><i class="fas fa-birthday-cake w-5 text-center text-gray-400 mr-2"></i><span>${athlete.age} years old</span></div>
                    <div class="flex items-center text-gray-600"><i class="fas fa-trophy w-5 text-center text-gray-400 mr-2"></i><span>${athlete.wins} Wins / ${athlete.losses} Losses</span></div>
                </div>
            </div>`;
        }).join('');
    }

    showAthleteDetailModal(athleteId: string) {
        const data = this.db.getData();
        const athlete = data.athletes.find(a => a.id === athleteId);
        
        if (!athlete) {
            this.showNotification('Athlete not found.', 'error');
            return;
        }

        // Populate basic info
        (document.getElementById('detailAthleteName') as HTMLElement).textContent = athlete.name;
        (document.getElementById('detailAthleteId') as HTMLElement).textContent = athlete.id;
        (document.getElementById('detailAthleteClub') as HTMLElement).textContent = athlete.club;
        (document.getElementById('detailAthleteRegion') as HTMLElement).textContent = athlete.region;
        (document.getElementById('detailAthleteAge') as HTMLElement).textContent = `${athlete.age} years old`;
        (document.getElementById('detailAthleteNotes') as HTMLElement).textContent = athlete.coachNotes || "No notes available.";
        
        // Profile Image
        const detailImage = document.getElementById('detailAthleteImage') as HTMLImageElement;
        detailImage.src = athlete.profilePicture || `https://i.pravatar.cc/300?u=${athlete.id}`;

        // Belt
        const beltEl = document.getElementById('detailAthleteBelt') as HTMLElement;
        const beltColors = {
            'Black': 'belt-black text-white', 'Red': 'belt-red text-white', 'Blue': 'belt-blue text-white',
            'Green': 'belt-green text-white', 'Yellow': 'belt-yellow text-gray-800', 'White': 'belt-white text-gray-800'
        };
        beltEl.className = `text-center font-bold px-3 py-2 rounded-lg text-lg ${beltColors[athlete.belt] || 'bg-gray-200 text-gray-800'}`;
        beltEl.textContent = `${athlete.belt} Belt`;

        // Performance Stats
        const totalFights = athlete.wins + athlete.losses;
        const winRate = totalFights > 0 ? `${((athlete.wins / totalFights) * 100).toFixed(0)}%` : 'N/A';
        (document.getElementById('detailAthleteWins') as HTMLElement).textContent = String(athlete.wins);
        (document.getElementById('detailAthleteLosses') as HTMLElement).textContent = String(athlete.losses);
        (document.getElementById('detailAthleteWinRate') as HTMLElement).textContent = winRate;
        
        // Dan Test History
        const danTests = data.danTests.filter(t => t.athleteId === athleteId);
        const danHistoryContainer = document.getElementById('detailAthleteDanHistory');
        if (danTests.length > 0) {
            danHistoryContainer.innerHTML = danTests.map(test => `
                <li class="bg-gray-50 p-2 rounded-md flex justify-between items-center">
                    <div>
                        <strong>${test.danLevel}st Dan Test</strong> - ${test.testDate}
                    </div>
                    <span class="px-2 py-0.5 text-xs rounded-full ${test.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${test.result}</span>
                </li>
            `).join('');
        } else {
            danHistoryContainer.innerHTML = `<li class="text-gray-500 italic">No Dan test history found.</li>`;
        }

        // Registered Events
        const registeredEvents = data.events.filter(e => e.registeredAthletes.includes(athleteId));
        const eventsContainer = document.getElementById('detailAthleteEvents');
        if (registeredEvents.length > 0) {
            eventsContainer.innerHTML = registeredEvents.map(event => `
                <li class="bg-gray-50 p-2 rounded-md">
                    <strong>${event.name}</strong> - ${event.date} (${event.location})
                </li>
            `).join('');
        } else {
            eventsContainer.innerHTML = `<li class="text-gray-500 italic">Not registered for any upcoming events.</li>`;
        }
        
        this.showModal('athleteDetailModal');
    }

    async findTalentGem() {
        if (!this.ai) {
            this.showNotification('Please provide a Gemini API Key to use this feature.', 'warning');
            return;
        }

        const modal = document.getElementById('talentGemModal');
        const loadingState = document.getElementById('gemLoadingState');
        const contentState = document.getElementById('gemContentState');

        this.showModal('talentGemModal');
        loadingState.style.display = 'flex';
        contentState.style.display = 'none';

        try {
            const athletes = this.db.getData().athletes;
            if (!athletes || athletes.length === 0) {
                throw new Error("No athlete data available to analyze.");
            }
            const prompt = `You are an expert Taekwondo talent scout for the Pakistan Taekwondo Federation. Analyze the following list of athletes and identify one 'hidden gem' with the most potential for future national and international success. Your decision should be based on a holistic view of their age, win/loss record, and the qualitative coach's notes. Pick an athlete who is not just good now, but has the clear potential to become a champion. Provide the 'id' of the athlete you choose and a compelling, 2-3 sentence justification for your selection, explaining why they are a 'gem'. Here is the athlete data in JSON format: ${JSON.stringify(athletes)}`;
            
            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            athleteId: { type: Type.STRING, description: "The unique ID of the chosen athlete, for example 'PTF-004'." },
                            justification: { type: Type.STRING, description: "A compelling 2-3 sentence justification for the choice." }
                        }
                    },
                },
            });
            
            // FIX: Trim whitespace from the JSON string before parsing to prevent errors.
            const result = JSON.parse(response.text.trim()) as { athleteId: string, justification: string };
            const gem = athletes.find(a => a.id === result.athleteId);

            if (!gem) throw new Error("AI returned an invalid athlete ID.");
            
            this.renderTalentGem(gem, result.justification);

        } catch (error) {
            console.error("Error finding talent gem:", error);
            this.hideModals();
            this.showNotification('Could not find a talent gem. Please try again.', 'error');
        } finally {
            loadingState.style.display = 'none';
            contentState.style.display = 'block';
        }
    }

    renderTalentGem(athlete, justification) {
        const beltColors = {
            'Black': 'belt-black text-white', 'Red': 'belt-red text-white', 'Blue': 'belt-blue text-white',
            'Green': 'belt-green text-white', 'Yellow': 'belt-yellow text-gray-800', 'White': 'belt-white text-gray-800'
        };
        const beltClass = beltColors[athlete.belt] || 'bg-gray-200 text-gray-800';

        document.getElementById('gemAthleteName').textContent = athlete.name;
        document.getElementById('gemAthleteId').textContent = athlete.id;
        document.getElementById('gemAthleteBelt').className = `text-sm font-bold px-4 py-1.5 rounded-full ${beltClass}`;
        document.getElementById('gemAthleteBelt').textContent = `${athlete.belt} Belt`;
        document.getElementById('gemAthleteClub').textContent = athlete.club;
        document.getElementById('gemAthleteRegion').textContent = athlete.region;
        document.getElementById('gemAthleteAge').textContent = `${athlete.age} years old`;
        document.getElementById('gemAthleteRecord').textContent = `${athlete.wins} Wins / ${athlete.losses} Losses`;
        document.getElementById('gemJustification').textContent = justification;
    }

    async generateInsights() {
        if (!this.ai) {
            this.showNotification('Please provide a Gemini API Key to use this feature.', 'warning');
            return;
        }
        const placeholder = document.getElementById('insightsPlaceholder');
        const loading = document.getElementById('insightsLoading');
        const result = document.getElementById('insightsResult');
    
        placeholder.classList.add('hidden');
        result.classList.add('hidden');
        loading.classList.remove('hidden');
    
        try {
            const federationData = this.db.getData();
            const prompt = `You are an expert sports federation analyst. Based on the following JSON data for the Pakistan Taekwondo Federation, provide a detailed analysis. The data includes general stats, recent activities, and upcoming events. Provide actionable insights and strategic recommendations. The data is: ${JSON.stringify(federationData)}`;
            
            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            key_takeaways: { type: Type.ARRAY, description: "A list of 3-4 bullet-point summary of the most important insights.", items: { type: Type.STRING } },
                            growth_opportunities: { type: Type.ARRAY, description: "Suggestions for how the federation can grow, e.g., targeting specific regions, new event types.", items: { type: Type.STRING } },
                            potential_risks: { type: Type.ARRAY, description: "Identify potential risks, e.g., over-reliance on one region, low engagement in certain event types.", items: { type: Type.STRING } },
                            actionable_suggestions: { type: Type.ARRAY, description: "A list of concrete next steps the federation administration can take.", items: { type: Type.STRING } }
                        }
                    },
                },
            });
    
            // FIX: Trim whitespace from the JSON string before parsing to prevent errors.
            const insights = JSON.parse(response.text.trim()) as {
                key_takeaways: string[];
                growth_opportunities: string[];
                potential_risks: string[];
                actionable_suggestions: string[];
            };
            this.renderInsights(insights);
    
        } catch (error) {
            console.error("Error generating insights:", error);
            this.showNotification('Failed to generate AI insights.', 'error');
            result.innerHTML = `<div class="text-center text-red-500"><p>An error occurred. Please check the console and try again.</p></div>`;
            placeholder.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
            result.classList.remove('hidden');
        }
    }

    renderInsights(data) {
        const resultContainer = document.getElementById('insightsResult');
        const insightTemplate = (title, icon, color, items) => `
            <div class="bg-gray-100/50 rounded-xl p-6">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-100 mr-4">
                        <i class="fas ${icon} text-${color}-600"></i>
                    </div>
                    <h4 class="text-lg font-bold text-gray-800">${title}</h4>
                </div>
                <ul class="space-y-3 text-gray-600 list-disc list-inside">
                    ${items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    
        resultContainer.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6 fade-in">
                ${insightTemplate('Key Takeaways', 'fa-key', 'emerald', data.key_takeaways)}
                ${insightTemplate('Growth Opportunities', 'fa-rocket', 'blue', data.growth_opportunities)}
                ${insightTemplate('Potential Risks', 'fa-exclamation-triangle', 'amber', data.potential_risks)}
                ${insightTemplate('Actionable Suggestions', 'fa-clipboard-check', 'purple', data.actionable_suggestions)}
            </div>
        `;
    }
    
    async generatePoomsae() {
        if (!this.ai) {
            this.showNotification('Please provide a Gemini API Key to use this feature.', 'warning');
            return;
        }
        const placeholder = document.getElementById('poomsaePlaceholder');
        const loading = document.getElementById('poomsaeLoading');
        const result = document.getElementById('poomsaeResult');

        const inspiration = (document.getElementById('poomsaeInspiration') as HTMLInputElement).value;
        const difficulty = (document.getElementById('poomsaeDifficulty') as HTMLSelectElement).value;
        const moves = (document.getElementById('poomsaeMoves') as HTMLInputElement).value;

        if (!inspiration || !moves) {
            this.showNotification('Please fill all fields to generate a Poomsae.', 'warning');
            return;
        }

        placeholder.classList.add('hidden');
        result.classList.add('hidden');
        loading.classList.remove('hidden');

        try {
            const prompt = `Act as a Taekwondo Grandmaster. Create a new Poomsae (form) for the Pakistan Taekwondo Federation.
            - The core inspiration is: "${inspiration}".
            - The difficulty should be for a "${difficulty}" level practitioner.
            - It should have approximately ${moves} moves.

            Provide a creative, authentic-sounding Korean name for the Poomsae, its English translation, a short description of its philosophy, and a list of 3-5 key movements or techniques that define the form.`;

            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            poomsae_name: { type: Type.STRING, description: "A creative Korean name for the form (e.g., 'Cheon-ji')." },
                            english_translation: { type: Type.STRING, description: "The English translation of the name (e.g., 'Heaven and Earth')." },
                            description: { type: Type.STRING, description: "A paragraph describing the form's philosophy and focus." },
                            key_movements: { type: Type.ARRAY, description: "An array of 3-5 strings listing signature moves.", items: { type: Type.STRING } },
                        }
                    },
                },
            });

            // FIX: Trim whitespace from the JSON string before parsing to prevent errors.
            const poomsaeData = JSON.parse(response.text.trim()) as {
                poomsae_name: string;
                english_translation: string;
                description: string;
                key_movements: string[];
            };
            this.renderPoomsae(poomsaeData);

        } catch (error) {
            console.error("Error generating Poomsae:", error);
            this.showNotification('Failed to generate AI Poomsae.', 'error');
            placeholder.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
            result.classList.remove('hidden');
        }
    }

    renderPoomsae(data) {
        const resultContainer = document.getElementById('poomsaeResult');
        resultContainer.innerHTML = `
            <div class="poomsae-card fade-in">
                <div class="text-center mb-4">
                    <h3 class="text-3xl font-bold text-gray-800">${data.poomsae_name}</h3>
                    <p class="text-lg text-emerald-600 font-medium">"${data.english_translation}"</p>
                </div>
                <div class="mb-6">
                    <h4 class="font-bold text-gray-700 mb-2">Philosophy</h4>
                    <p class="text-gray-600">${data.description}</p>
                </div>
                <div>
                    <h4 class="font-bold text-gray-700 mb-3">Key Movements</h4>
                    <ul class="space-y-2">
                        ${data.key_movements.map(move => `
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-fist-raised text-emerald-500 w-5 text-center mr-3"></i>
                                <span>${move}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    async generateKyorugiPlan() {
        if (!this.ai) {
            this.showNotification('Please provide a Gemini API Key to use this feature.', 'warning');
            return;
        }

        const placeholder = document.getElementById('kyorugiPlaceholder');
        const loading = document.getElementById('kyorugiLoading');
        const result = document.getElementById('kyorugiResult');

        const athleteId = (document.getElementById('kyorugiAthlete') as HTMLSelectElement).value;
        const focus = (document.getElementById('kyorugiFocus') as HTMLSelectElement).value;
        const duration = (document.getElementById('kyorugiDuration') as HTMLSelectElement).value;

        if (!athleteId) {
            this.showNotification('Please select an athlete.', 'warning');
            return;
        }

        placeholder.classList.add('hidden');
        result.classList.add('hidden');
        loading.classList.remove('hidden');

        try {
            const athlete = this.db.getData().athletes.find(a => a.id === athleteId);
            if (!athlete) throw new Error("Selected athlete not found.");

            const prompt = `Act as a world-class Taekwondo Kyorugi (sparring) coach for the Pakistan Taekwondo Federation.
            Create a detailed training plan for an athlete named ${athlete.name}.
            
            Athlete's Current Profile:
            - Age: ${athlete.age}
            - Belt Level: ${athlete.belt}
            - Record: ${athlete.wins} Wins / ${athlete.losses} Losses
            - Coach's Notes: ${athlete.coachNotes || 'N/A'}

            Training Plan Requirements:
            - Duration: ${duration}
            - Primary Focus: ${focus}

            The plan should be broken down weekly. For each week, provide a specific theme, a list of 3-4 key drills, and a list of 2-3 conditioning exercises.
            `;

            const response = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            planTitle: { type: Type.STRING, description: "A creative and motivational title for the training plan." },
                            weeklyBreakdown: {
                                type: Type.ARRAY,
                                description: "An array of weekly training schedules.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        week: { type: Type.STRING, description: "The week number, e.g., 'Week 1'." },
                                        theme: { type: Type.STRING, description: "The main theme or focus for the week." },
                                        drills: { type: Type.ARRAY, description: "A list of 3-4 specific Kyorugi drills.", items: { type: Type.STRING } },
                                        conditioning: { type: Type.ARRAY, description: "A list of 2-3 conditioning exercises.", items: { type: Type.STRING } },
                                    }
                                }
                            }
                        }
                    },
                },
            });

            const planData = JSON.parse(response.text.trim());
            this.renderKyorugiPlan(planData, athlete);

        } catch (error) {
            console.error("Error generating Kyorugi plan:", error);
            this.showNotification('Failed to generate AI training plan.', 'error');
            placeholder.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
            result.classList.remove('hidden');
        }
    }

    renderKyorugiPlan(data, athlete) {
        const resultContainer = document.getElementById('kyorugiResult');
        resultContainer.innerHTML = `
            <div class="fade-in space-y-4">
                <div class="text-center mb-4">
                    <h3 class="text-2xl font-bold text-gray-800">${data.planTitle}</h3>
                    <p class="text-md text-blue-600 font-medium">For ${athlete.name}</p>
                </div>

                <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    ${data.weeklyBreakdown.map(week => `
                        <div class="bg-white p-4 rounded-lg border">
                            <h4 class="font-bold text-lg text-gray-700 mb-3">${week.week}: <span class="font-medium text-gray-600">${week.theme}</span></h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h5 class="font-semibold text-sm text-gray-500 mb-2 uppercase tracking-wider">Key Drills</h5>
                                    <ul class="space-y-2">
                                        ${week.drills.map(drill => `
                                            <li class="flex items-start text-gray-600">
                                                <i class="fas fa-fist-raised text-blue-500 w-4 text-center mr-3 pt-1"></i>
                                                <span>${drill}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <h5 class="font-semibold text-sm text-gray-500 mb-2 uppercase tracking-wider">Conditioning</h5>
                                    <ul class="space-y-2">
                                        ${week.conditioning.map(cond => `
                                            <li class="flex items-start text-gray-600">
                                                <i class="fas fa-heartbeat text-red-500 w-4 text-center mr-3 pt-1"></i>
                                                <span>${cond}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getActivityIcon(type) {
        const icons = { 'Dan Test': 'user-graduate', 'Registration': 'user-plus', 'Competition': 'trophy', 'Training': 'dumbbell', 'License': 'id-card' };
        return icons[type] || 'calendar';
    }
    
    formatActivityDetails(activity) {
        if (activity.score) return `Score: ${activity.score}`;
        if (activity.club) return `Club: ${activity.club}`;
        if (activity.deadline) return `Deadline: ${activity.deadline}`;
        if (activity.status) return activity.status;
        return activity.type;
    }
    
    getEventColor(event) {
        const statusMap = { 'Registration Open': 'emerald', 'Limited Seats': 'blue', 'Selection Based': 'amber' };
        return statusMap[event.status] || 'gray';
    }
    
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-emerald-50', 'text-emerald-700');
            btn.classList.add('text-gray-600');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-emerald-50', 'text-emerald-700');
            activeBtn.classList.remove('text-gray-600');
        }
        
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.remove('hidden', 'fade-in');
            void activeContent.offsetWidth;
            activeContent.classList.add('fade-in');
        }

        if (tabName === 'athletes') {
            (document.getElementById('athleteSearchInput') as HTMLInputElement).value = '';
            (document.getElementById('athleteBeltFilter') as HTMLSelectElement).value = 'All';
            (document.getElementById('athleteRegionFilter') as HTMLSelectElement).value = 'All';
            this.renderAthletes();
        }

        if (tabName === 'curriculum') {
            this.populateKyorugiAthleteSelect();
        }

        if (tabName === 'regions') {
            this.renderRegionsAndDeptsPage();
        }
        if (tabName === 'users') {
            this.renderUserManagement();
        }
        if (tabName === 'danTests') {
            this.renderDanTests();
        }
        if (tabName === 'licensing') {
            this.renderLicenses();
        }
    }

    populateKyorugiAthleteSelect() {
        const athletes = this.db.getData().athletes || [];
        const athleteSelect = document.getElementById('kyorugiAthlete') as HTMLSelectElement;
        if (!athleteSelect) return;

        athleteSelect.innerHTML = '<option value="">Select an athlete</option>';
        athletes.forEach(athlete => {
            athleteSelect.innerHTML += `<option value="${athlete.id}">${athlete.name} (${athlete.id})</option>`;
        });
    }

    renderRegionsAndDeptsPage() {
        const container = document.getElementById('regions');
        if (!container) return;
    
        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm p-6 card-hover">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Manage Regions & Departments</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Regions Section -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-semibold text-gray-700">Regions</h3>
                            <button id="addRegionBtn" class="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">Add Region</button>
                        </div>
                        <div id="regionListContainer" class="space-y-3">
                            <!-- Region items rendered here -->
                        </div>
                    </div>
                    <!-- Departments Section -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-semibold text-gray-700">Departments</h3>
                            <button id="addDeptBtn" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">Add Department</button>
                        </div>
                        <div id="departmentListContainer" class="space-y-3">
                            <!-- Department items rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        const data = this.db.getData().regionalStats;
        const regionListContainer = document.getElementById('regionListContainer');
        const departmentListContainer = document.getElementById('departmentListContainer');
    
        const itemTemplate = (name, stats, type, index) => `
            <div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center border animate-in" style="animation-delay: ${index * 0.05}s">
                <div>
                    <p class="font-bold text-gray-800 flex items-center"><i class="fas ${stats.icon} w-5 text-center text-gray-400 mr-2"></i>${name}</p>
                    <p class="text-sm text-gray-500 ml-7">${stats.athletes.toLocaleString()} Athletes, ${stats.clubs.toLocaleString()} Clubs</p>
                </div>
                <div class="space-x-2">
                    <button class="edit-btn text-gray-500 hover:text-emerald-600" data-type="${type}" data-name="${name}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn text-red-400 hover:text-red-600" data-type="${type}" data-name="${name}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    
        if (data.regions && regionListContainer) {
            regionListContainer.innerHTML = Object.entries(data.regions)
                .map(([name, stats], index) => itemTemplate(name, stats, 'regions', index)).join('');
        }
        
        if (data.departments && departmentListContainer) {
            departmentListContainer.innerHTML = Object.entries(data.departments)
                .map(([name, stats], index) => itemTemplate(name, stats, 'departments', index)).join('');
        }
    
        // Add event listeners for the new buttons
        document.getElementById('addRegionBtn').addEventListener('click', () => this.showRegionDeptModal('regions'));
        document.getElementById('addDeptBtn').addEventListener('click', () => this.showRegionDeptModal('departments'));
    
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                const name = btn.getAttribute('data-name');
                if (type && name) {
                    const entryData = this.db.getData().regionalStats?.[type]?.[name];
                    // FIX: Spread operator was used on `entryData`, which could be undefined, causing "Spread types may only be created from object types" error.
                    // Added a guard to ensure `entryData` is a valid object before using its properties.
                    if (entryData && typeof entryData === 'object' && !Array.isArray(entryData)) {
                        // Manually construct the object to pass to the modal for better type safety.
                        const modalData = { name, athletes: entryData.athletes, clubs: entryData.clubs, icon: entryData.icon };
                        this.showRegionDeptModal(type, true, modalData);
                    }
                }
            });
        });
    
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                const name = btn.getAttribute('data-name');
                // FIX: Add a guard to ensure `type` and `name` are not null before calling the delete function, preventing potential runtime errors.
                if (type && name) {
                    this.deleteRegionDept(type, name);
                }
            });
        });
    }
    
    showRegionDeptModal(type, isEdit = false, data: { name?: string, athletes?: number, clubs?: number, icon?: string } = {}) {
        const form = document.getElementById('regionDeptForm') as HTMLFormElement;
        const title = document.getElementById('regionDeptModalTitle');
    
        form.reset();
    
        (document.getElementById('regionDeptType') as HTMLInputElement).value = type;
    
        if (isEdit) {
            title.textContent = `Edit ${type === 'regions' ? 'Region' : 'Department'}`;
            (document.getElementById('originalName') as HTMLInputElement).value = data.name;
            (document.getElementById('regionDeptName') as HTMLInputElement).value = data.name;
            (document.getElementById('regionDeptAthletes') as HTMLInputElement).value = String(data.athletes);
            (document.getElementById('regionDeptClubs') as HTMLInputElement).value = String(data.clubs);
            (document.getElementById('regionDeptIcon') as HTMLInputElement).value = data.icon;
        } else {
            title.textContent = `Add New ${type === 'regions' ? 'Region' : 'Department'}`;
            (document.getElementById('originalName') as HTMLInputElement).value = '';
        }
        
        this.showModal('regionDeptModal');
    }
    
    saveRegionDept() {
        const form = document.getElementById('regionDeptForm') as HTMLFormElement;
        const formData = new FormData(form);
    
        const type = formData.get('type') as string;
        const originalName = formData.get('originalName') as string || null;
        const name = (formData.get('name') as string)?.trim();
        const athletesStr = formData.get('athletes') as string;
        const clubsStr = formData.get('clubs') as string;
        const icon = (formData.get('icon') as string)?.trim();
    
        if (!type || !name || !athletesStr || !clubsStr || !icon) {
            this.showNotification('All fields are required.', 'error');
            return;
        }
    
        const athletes = parseInt(athletesStr, 10);
        const clubs = parseInt(clubsStr, 10);
    
        if (isNaN(athletes) || athletes < 0 || isNaN(clubs) || clubs < 0) {
            this.showNotification('Athletes and Clubs must be valid, non-negative numbers.', 'error');
            return;
        }
    
        const data = {
            athletes: athletes,
            clubs: clubs,
            icon: icon,
        };
    
        this.db.updateRegionDept(type, name, data, originalName);
    
        this.hideModals();
        this.showNotification('Data saved successfully!', 'success');
        this.renderRegionsAndDeptsPage(); // Re-render the edit page
        this.renderAnalyticsChart(); // Re-render the dashboard stats
    }
    
    // FIX: Add explicit string types to parameters to improve type safety.
    deleteRegionDept(type: string, name: string) {
        if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            this.db.deleteRegionDept(type, name);
            this.showNotification(`"${name}" has been deleted.`, 'success');
            this.renderRegionsAndDeptsPage(); // Re-render the edit page
            this.renderAnalyticsChart(); // Re-render the dashboard stats
        }
    }

    renderUserManagement() {
        if (this.currentUser.role !== 'Admin') return;

        const container = document.getElementById('users');
        const users = this.db.getUsers();

        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm p-6 card-hover">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">User Management</h2>
                    <button id="addUserBtn" class="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">Add User</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b">
                                <th class="p-3">Name</th>
                                <th class="p-3">Email</th>
                                <th class="p-3">Role</th>
                                <th class="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map((user, index) => `
                                <tr class="border-b hover:bg-gray-50 animate-in" style="animation-delay: ${index * 0.05}s">
                                    <td class="p-3 flex items-center space-x-3">
                                        <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full object-cover">
                                        <span class="font-medium">${user.name}</span>
                                    </td>
                                    <td class="p-3 text-gray-600">${user.email}</td>
                                    <td class="p-3">
                                        <span class="px-2 py-1 text-xs rounded-full ${user.role === 'Admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">${user.role}</span>
                                    </td>
                                    <td class="p-3 text-right">
                                        <button class="edit-user-btn text-gray-500 hover:text-emerald-600 mr-2" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                                        <button class="delete-user-btn text-red-400 hover:text-red-600" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        document.getElementById('addUserBtn').addEventListener('click', () => this.showUserModal());
        document.querySelectorAll('.edit-user-btn').forEach(btn => btn.addEventListener('click', (e) => this.showUserModal(e)));
        document.querySelectorAll('.delete-user-btn').forEach(btn => btn.addEventListener('click', (e) => this.deleteUser(e)));
    }
    
    showUserModal(e?: Event) {
        const form = document.getElementById('userForm') as HTMLFormElement;
        form.reset();
        
        const title = document.getElementById('userModalTitle');
        (document.getElementById('userId') as HTMLInputElement).value = '';
        (document.getElementById('userPassword') as HTMLInputElement).placeholder = 'Enter password';

        if (e) { // Editing existing user
            title.textContent = 'Edit User';
            (document.getElementById('userPassword') as HTMLInputElement).placeholder = 'Leave blank to keep unchanged';
            const userId = parseInt((e.currentTarget as HTMLElement).getAttribute('data-id'));
            const user = this.db.getUsers().find(u => u.id === userId);
            if (user) {
                // FIX: The properties of `user` (from JSON) are of type `any`/`unknown` which is not safely assignable to a `string` input value.
                // Explicitly convert user properties to strings to fix the type mismatch.
                (document.getElementById('userId') as HTMLInputElement).value = String(user.id);
                (document.getElementById('userName') as HTMLInputElement).value = String(user.name);
                (document.getElementById('userEmail') as HTMLInputElement).value = String(user.email);
                (document.getElementById('userRole') as HTMLSelectElement).value = String(user.role);
            }
        } else { // Adding new user
            title.textContent = 'Add New User';
        }

        this.showModal('userModal');
    }

    saveUser() {
        const form = document.getElementById('userForm') as HTMLFormElement;
        const formData = new FormData(form);
        const userId = parseInt(formData.get('id') as string);
        const name = (formData.get('name') as string)?.trim();
        const email = (formData.get('email') as string)?.trim();
        const password = (formData.get('password') as string);
        const role = formData.get('role') as string;

        if (!name || !email || (!userId && !password)) { // Password required for new users
            this.showNotification('Name, email, and password (for new users) are required.', 'error');
            return;
        }

        if (userId) { // Update
            this.db.updateUser({ id: userId, name, email, password, role });
            this.showNotification('User updated successfully', 'success');
        } else { // Add
            this.db.addUser({ name, email, password, role });
            this.showNotification('User added successfully', 'success');
        }

        this.hideModals();
        this.renderUserManagement();
    }
    
    deleteUser(e: Event) {
        const userId = parseInt((e.currentTarget as HTMLElement).getAttribute('data-id'));
        if (userId === this.currentUser.id) {
            this.showNotification("You cannot delete your own account.", 'error');
            return;
        }
        if (confirm('Are you sure you want to delete this user?')) {
            if (this.db.deleteUser(userId)) {
                this.showNotification('User deleted successfully', 'success');
                this.renderUserManagement();
            } else {
                this.showNotification('Failed to delete user.', 'error');
            }
        }
    }
    
    showRegistrationModal(eventId: number) {
        const data = this.db.getData();
        const event = data.events.find(e => e.id === eventId);
        const allAthletes = data.athletes || [];
        
        if (!event) {
            this.showNotification("Event not found.", 'error');
            return;
        }
        
        document.getElementById('registrationModalEventName').textContent = event.name;
        
        const container = document.getElementById('registrationAthleteList');
        const searchInput = document.getElementById('registrationAthleteSearch') as HTMLInputElement;
        
        const renderList = (filter = '') => {
            const filteredAthletes = allAthletes.filter(athlete => 
                athlete.name.toLowerCase().includes(filter.toLowerCase()) || 
                athlete.club.toLowerCase().includes(filter.toLowerCase())
            );
            
            container.innerHTML = filteredAthletes.map(athlete => `
                <div class="registration-athlete-item">
                    <label for="reg-ath-${athlete.id}">
                        <input type="checkbox" id="reg-ath-${athlete.id}" name="athleteIds" value="${athlete.id}" 
                            ${event.registeredAthletes.includes(athlete.id) ? 'checked' : ''}>
                        <span>${athlete.name} <span class="text-gray-500 text-sm">(${athlete.club})</span></span>
                    </label>
                </div>
            `).join('');
        };
        
        searchInput.value = '';
        searchInput.oninput = () => renderList(searchInput.value);
        renderList();
        
        (document.getElementById('registerAthletesForm') as HTMLFormElement).dataset.eventId = String(eventId);
        this.showModal('registerAthletesModal');
    }
    
    saveEventRegistration() {
        const form = document.getElementById('registerAthletesForm') as HTMLFormElement;
        const eventId = parseInt(form.dataset.eventId);
        
        const selectedAthleteIds = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="athleteIds"]:checked'))
                                       .map(input => input.value);

        if (this.db.registerAthletesForEvent(eventId, selectedAthleteIds)) {
            this.hideModals();
            this.renderEvents();
            this.showNotification(`${selectedAthleteIds.length} athletes registered for the event.`, 'success');
        } else {
            this.showNotification('Failed to save registration.', 'error');
        }
    }

    applyTheme() {
        const toggle = document.getElementById('darkModeToggle') as HTMLInputElement;
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (toggle) toggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            if (toggle) toggle.checked = false;
        }
    }

    toggleDarkMode() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('ptfTheme', this.theme);
        this.applyTheme();
        this.renderAnalyticsChart();
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const typeClasses = {
            success: 'bg-green-500 text-white', warning: 'bg-amber-500 text-white',
            error: 'bg-red-500 text-white', info: 'bg-blue-500 text-white',
        };
        const typeIcons = {
            success: 'fa-check-circle', warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle', info: 'fa-info-circle'
        }
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg notification max-w-sm ${typeClasses[type]}`;
        
        notification.innerHTML = `<div class="flex items-center justify-between">
            <div class="flex items-center"><i class="fas ${typeIcons[type]} mr-2"></i><span>${message}</span></div>
            <button class="ml-4 text-white/70 hover:text-white close-notification"><i class="fas fa-times"></i></button>
        </div>`;
        
        document.body.appendChild(notification);
        
        const close = () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        };

        notification.querySelector('.close-notification').addEventListener('click', close);
        setTimeout(close, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const app = new PTFUIController();
    window.ptfApp = app; // Make app globally available for debugging
});