class Student {
    #grades;
    #attendance;
    constructor(name, g1, g2, g3, attendance) {
        this.name = name;
        this.grades = [g1, g2, g3];
        this.attendance = attendance;
    }
    set grades(values) {
        for (let g of values) {
            if (g === "" || g === null || isNaN(g)) throw new Error("من فضلك املأ كل الدرجات");
            if (g < 0 || g > 100) throw new Error("الدرجة لازم تكون من 0 لـ 100");
        }
        this.#grades = values.map(Number);
    }
    get grades() { return this.#grades; }
    set attendance(val) {
        if (val === "" || val === null || isNaN(val)) throw new Error("من فضلك اكتب نسبة الحضور");
        if (val < 0 || val > 100) throw new Error("الحضور لازم يكون من 0 لـ 100");
        this.#attendance = Number(val);
    }
    get attendance() { return this.#attendance; }
    getAverage() { return Math.round((this.#grades[0] + this.#grades[1] + this.#grades[2]) / 3); }
}

let studentsList = [];
let errorBox = document.getElementById("errorBox");
let listDiv = document.getElementById("studentsListDiv");
let reportDiv = document.getElementById("finalReport");

document.getElementById("addBtn").onclick = function () {
    try {
        errorBox.classList.add("d-none");
        let name = document.getElementById("studentName").value.trim();
        if (!name) throw new Error("من فضلك اكتب اسم الطالب");
        let s = new Student(name, document.getElementById("grade1").value, document.getElementById("grade2").value, document.getElementById("grade3").value, document.getElementById("attendance").value);
        studentsList.push(s);
        render();
        document.getElementById("studentName").value = ""; document.getElementById("grade1").value = ""; document.getElementById("grade2").value = ""; document.getElementById("grade3").value = ""; document.getElementById("attendance").value = "";
    } catch (error) {
        errorBox.innerText = error.message;
        errorBox.classList.remove("d-none");
    }
};

function render() {
    document.getElementById("count").innerText = studentsList.length;
    listDiv.innerHTML = studentsList.map(st => `<div>✅ ${st.name} - م1: ${st.grades[0]} - م2: ${st.grades[1]} - م3: ${st.grades[2]} - متوسط: ${st.getAverage()} - حضور: ${st.attendance}%</div>`).join("");
    let nag7 = studentsList.filter(s => s.getAverage() >= 50 && s.attendance >= 75).length;
    let raseb = studentsList.length - nag7;
    let perc = studentsList.length ? Math.round(nag7 / studentsList.length * 100) : 0;
    document.getElementById("s1").innerText = studentsList.length;
    document.getElementById("s2").innerText = nag7;
    document.getElementById("s3").innerText = raseb;
    document.getElementById("s4").innerText = perc + "%";
}

document.getElementById("mercyBtn").onclick = function () {
    let strugglers = studentsList.filter(s => s.getAverage() >= 40 && s.getAverage() <= 49);
    let afterMercy = strugglers.map(s => ({ name: s.name, oldAvg: s.getAverage(), newAvg: s.getAverage() + 5 }));
    let total = afterMercy.reduce((sum, s) => sum + s.newAvg, 0);
    let generalAvg = afterMercy.length ? (total / afterMercy.length).toFixed(1) : 0;
    reportDiv.innerHTML = `
    <b>عدد الطلاب المتعثرين:</b> ${strugglers.length} <br>
    <b>أسمائهم:</b> ${afterMercy.map(s => `${s.name} (${s.oldAvg} -> ${s.newAvg})`).join(" ، ") || "لا يوجد"} <br>
    <b>المتوسط العام بعد الرأفة:</b> ${generalAvg}
  `;
};