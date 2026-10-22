#!/usr/bin/env sh

##############################################################################
##
##  Gradle start up script for UN*X
##
##############################################################################

# Attempt to set APP_HOME
PRG="$0"

# Need this for relative symlinks.
while [ -h "$PRG" ] ; do
    ls=`ls -ld "$PRG"`
    link=`expr "$ls" : '.*-> \(.*\)$'`
    if expr "$link" : '/.*' > /dev/null; then
        PRG="$link"
    else
        PRG=`dirname "$PRG"`"/$link"
    fi
done

SAVED="`pwd`"
CDPATH=""
APP_HOME="`dirname "$PRG"`"
APP_HOME="`cd "$APP_HOME" && pwd`"
cd "$SAVED"

APP_NAME="Gradle"
APP_BASE_NAME=`basename "$0"`

# Add default JVM options here.
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'

# Find java
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        JAVACMD="$JAVA_HOME/jre/sh/java"
    else
        JAVACMD="$JAVA_HOME/bin/java"
    fi
else
    JAVACMD="java"
fi

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

# Execute Gradle Wrapper
exec "$JAVACMD" $DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS "-Dorg.gradle.appname=$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
