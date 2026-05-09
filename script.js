/* === QUẢN LÝ DỮ LIỆU === */
const MY_DATABASE_DEFAULT = [
    {
        "subject": "Dữ liệu mẫu",
        "description": "Bạn chưa nhập dữ liệu nào từ trang Admin.",
        "chapters": [
            {
                "title": "Chương 1",
                "desc": "Mô tả",
                "lessons": [{ "name": "Bài mẫu", "link1": "#", "link2": "#" }]
            }
        ]
    }
];

let ACADEMY_DATA = [];

function initData() {
    if (typeof ACADEMY_DB !== 'undefined') {
        ACADEMY_DATA = ACADEMY_DB;
    } else {
        ACADEMY_DATA = MY_DATABASE_DEFAULT;
    }
}

/* === ĐIỀU KHIỂN GIAO DIỆN === */

// 1. Hiển thị danh sách Môn học
function showSubjects() {
    initData();
    
    const layers = ['subject-layer', 'chapter-layer', 'lesson-layer'];
    layers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const subjectLayer = document.getElementById('subject-layer');
    if (subjectLayer) subjectLayer.classList.remove('hidden');

    // Breadcrumb mức gốc
    document.getElementById('breadcrumb').innerHTML = '<span onclick="showSubjects()">Trang chủ</span>';
    
    const subjectList = document.getElementById('subject-list');
    if (!subjectList) return;
    subjectList.innerHTML = '';

   ACADEMY_DATA.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => showChapters(index);
        
        // Sử dụng icon từ database hoặc icon mặc định nếu không có
        const iconSrc = item.icon || "https://cdn-icons-png.flaticon.com/512/3135/3135810.png";

        card.innerHTML = `
            <div class="card-icon">
                <img src="${iconSrc}" alt="icon">
            </div>
            <h3>${item.subject}</h3>
        `;
        subjectList.appendChild(card);
    });

}

// 2. Hiển thị danh sách Chương
function showChapters(subjectIndex) {
    const subject = ACADEMY_DATA[subjectIndex];
    
    document.getElementById('subject-layer').classList.add('hidden');
    document.getElementById('lesson-layer').classList.add('hidden'); // Đảm bảo ẩn lớp bài học nếu quay lại từ bài học
    document.getElementById('chapter-layer').classList.remove('hidden');

    // Breadcrumb mức môn học: Trang chủ / Tên môn
    document.getElementById('breadcrumb').innerHTML = `
        <span onclick="showSubjects()">Trang chủ</span> / 
        <span>${subject.subject}</span>
    `;
    
    document.getElementById('chapter-title').innerText = subject.subject;
    
    const chapterList = document.getElementById('chapter-list');
    chapterList.innerHTML = '';

    subject.chapters.forEach((chapter, cIndex) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => showLessons(subjectIndex, cIndex);
        card.innerHTML = `<h3>${chapter.title}</h3><p>${chapter.desc || ''}</p>`;
        chapterList.appendChild(card);
    });
}

// 3. Hiển thị danh sách Bài học (Đã cập nhật Breadcrumb đầy đủ)
function showLessons(sIndex, cIndex) {
    const subject = ACADEMY_DATA[sIndex];
    const chapter = subject.chapters[cIndex];
    
    document.getElementById('chapter-layer').classList.add('hidden');
    document.getElementById('lesson-layer').classList.remove('hidden');
    
    // Breadcrumb đầy đủ: Trang chủ / Tên môn / Tên chương
    document.getElementById('breadcrumb').innerHTML = `
        <span onclick="showSubjects()">Trang chủ</span> / 
        <span onclick="showChapters(${sIndex})">${subject.subject}</span> / 
        <span>${chapter.title}</span>
    `;
    
    document.getElementById('lesson-title').innerText = chapter.title;
    
    const lessonList = document.getElementById('lesson-list');
    lessonList.innerHTML = '';

chapter.lessons.forEach(lesson => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <div class="lesson-content">
            <span class="lesson-name">${lesson.name}</span>
            <div class="lesson-actions">
                <a href="${lesson.link1}" target="_blank" class="btn-practice">Luyện tập 1</a>
                <a href="${lesson.link2}" target="_blank" class="btn-practice practice-alt">Luyện tập 2</a>
            </div>
        </div>`;
    lessonList.appendChild(item);
});
}

/* === BẢO MẬT & LOGOUT === */
function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = "login.html";
}

/* === Sửa lại hàm khởi tạo trong script.js === */

/* === THAY THẾ TOÀN BỘ ĐOẠN DOMContentLoaded CUỐI FILE SCRIPT.JS === */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra trạng thái đăng nhập
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        const userName = sessionStorage.getItem('userName') || "Người dùng";
        const currentUser = sessionStorage.getItem('currentUser'); 
        const greetingEl = document.getElementById('user-greeting');
        
        // 2. Hiển thị lời chào
        if (greetingEl) {
            greetingEl.innerText = `Chào mừng, ${userName}!`;
        }

        // 3. KIỂM TRA QUYỀN ADMIN để hiện nút "Truy cập code"
        if (currentUser === 'admin') {
            const adminBtn = document.getElementById('admin-btn');
            if (adminBtn) adminBtn.classList.remove('hidden');
        }

        // 4. Khởi tạo dữ liệu và hiển thị danh sách môn học
        showSubjects();
    } else {
        // Nếu chưa đăng nhập mà không ở trang login thì chuyển hướng
        if (!window.location.href.includes('login.html')) {
            window.location.href = "login.html";
        }
    }
});

// Hàm điều hướng khi bấm nút "Truy cập code"
function goToAdmin() {
    // Bạn có thể đổi tên file này tùy ý
    window.location.href = "admin_editor.html"; 
}