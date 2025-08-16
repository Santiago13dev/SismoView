plugins {
    id("org.springframework.boot") version "3.3.2"
    id("io.spring.dependency-management") version "1.1.5"
    java
    id("com.diffplug.spotless") version "6.25.0"
    checkstyle
}

group = "com.sismoview"
version = "0.1.0"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
    useJUnitPlatform()
}

spotless {
    java {
        target("src/**/*.java")
        googleJavaFormat()
        trimTrailingWhitespace()
        endWithNewline()
    }
}

checkstyle {
    toolVersion = "10.12.4"
    config = resources.text.fromFile("config/checkstyle/checkstyle.xml")
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}
