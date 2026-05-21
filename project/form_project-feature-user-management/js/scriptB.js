let accounts = [{user:'Admin', name:'VPN_Default', id1:'08001234'}];
let currentPage = 1;
const itemsPerPage = 8;
let selectedIndex = -1;
let isDeleteMode = false;

export function renderList() {
    const listBody = document.getElementById('vpn-list');
    const start = (currentPage - 1) * itemsPerPage;
    const data = accounts.slice(start, start + itemsPerPage);

    listBody.innerHTML = Array.from({length: itemsPerPage}, (_, i) => {
        const item = data[i];
        if (!item) return `<div class="vpn-item" style="background:transparent; border:none; cursor:default"></div>`;
        const realIdx = start + i;
        return `<div class="vpn-item ${realIdx === selectedIndex ? 'selected' : ''}" onclick="selectItem(${realIdx})">
                    <div class="col">${item.user}</div><div class="col">${item.name}</div><div class="col">${item.id1}</div>
                </div>`;
    }).join('');
    
    document.getElementById('page-display').innerText = `第 ${currentPage} 頁 / 共 ${Math.ceil(accounts.length/itemsPerPage)} 頁`;
    document.getElementById('btn-primary').innerText = isDeleteMode ? "取消" : "新增";
    document.getElementById('btn-secondary').innerText = isDeleteMode ? "確認撤銷" : "撤銷";
}

function selectItem(idx) {
    selectedIndex = (selectedIndex === idx) ? -1 : idx;
    isDeleteMode = (selectedIndex !== -1);
    renderList();
}



function handleSecondaryAction() {
    if (isDeleteMode) {
        const t = accounts[selectedIndex];
        document.getElementById('del-name').innerText = t.name;
        document.getElementById('del-vlan').innerText = t.id1;
        document.getElementById('deleteModal').style.display = 'flex';
    } else {
        isDeleteMode = true; selectedIndex = -1; renderList();
    }
}

function handlePrimaryAction() {
    if (isDeleteMode) 
        {
             selectedIndex = -1; isDeleteMode = false; renderList(); 
        }else {
        document.getElementById('list-view').style.display = 'none';
        document.getElementById('list-actions').style.display = 'none';
        document.getElementById('add-view').style.display = 'flex';
    }
}

// 新增確認流程
function triggerAddConfirm() {
    const u = document.getElementById('in-user').value;
    const n = document.getElementById('in-name').value;
    const v = document.getElementById('in-vlan').value;
    if(!u || !n || !v) return alert("請填寫完整資訊");

    document.getElementById('conf-user').innerText = u;
    document.getElementById('conf-name').innerText = n;
    document.getElementById('conf-vlan').innerText = v;
    document.getElementById('addConfirmModal').style.display = 'flex';
}

function finalAddProcess() {
    const u = document.getElementById('in-user').value;
    const n = document.getElementById('in-name').value;
    const v = document.getElementById('in-vlan').value;
    accounts.push({user: u, name: n, id1: v});
    closeModal('addConfirmModal');
    goHome();
}

function confirmDelete() { accounts.splice(selectedIndex, 1); selectedIndex = -1; isDeleteMode = false; closeModal('deleteModal'); renderList(); }

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function goHome() {
    document.getElementById('add-view').style.display = 'none';
    document.getElementById('list-view').style.display = 'flex';
    document.getElementById('list-actions').style.display = 'flex';
    document.getElementById('in-user').value = "";
    document.getElementById('in-name').value = "";
    document.getElementById('in-vlan').value = "";
    renderList();
}

function changePage(d) {
    if(d==='next' && currentPage < Math.ceil(accounts.length/itemsPerPage)) currentPage++;
    if(d==='prev' && currentPage > 1) currentPage--;
    renderList();
}

function handleResize() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.getElementById('fixed-canvas').style.transform = `scale(${s})`;
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', () => { handleResize(); renderList(); });