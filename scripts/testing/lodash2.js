class A extends Error {
    constructor(m) {
        super(m);
    }
}

class B extends A {
    constructor(m) {
        super(m);
    }
}

class C extends A {
    constructor() {
        super();
    }
}

class D extends C {
    constructor() {
        super();
    }
}

exports.A = A;
exports.B = B;
exports.C = C;
exports.D = D;

