BUILD_DIR ?= dist
PROJECT_DIR ?= $(PWD)

$(BUILD_DIR): 
	cp -a src/ $(BUILD_DIR)

$(BUILD_DIR)/package.json:
	cp package.json $(BUILD_DIR)/

$(BUILD_DIR)/tsconfig.json:
	cp tsconfig.json $(BUILD_DIR)/

$(BUILD_DIR)/node_modules: $(BUILD_DIR)/package.json
	npm install

clean:
	rm -rf dist

build: clean $(BUILD_DIR) $(BUILD_DIR)/node_modules $(BUILD_DIR)/tsconfig.json
	cd dist && npm run build

link: build
	cd dist && npm link

dev: link